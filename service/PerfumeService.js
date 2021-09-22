'use strict';

let perfumeDao = require('../dao/PerfumeDao.js');
let reviewDao = require('../dao/ReviewDao.js');
let noteDao = require('../dao/NoteDao');
let likePerfumeDao = require('../dao/LikePerfumeDao.js');
let keywordDao = require('../dao/KeywordDao.js');
let userDao = require('../dao/UserDao.js');
const { getImageList } = require('../lib/s3.js');

const { parseSortToOrder } = require('../utils/parser.js');

const {
    GENDER_WOMAN,
    ABUNDANCE_RATE_LIST,
} = require('../utils/constantUtil.js');

const {
    NoteDictDTO,
    PerfumeSummaryDTO,
    PerfumeThumbDTO,
    PerfumeThumbKeywordDTO,
} = require('../data/dto');

const {
    NotMatchedError,
    FailedToCreateError,
} = require('../utils/errors/errors.js');

const {
    updateRows,
    removeKeyJob,
    extractJob,
    flatJob,
} = require('../utils/func.js');

function emptyCheck(x) {
    if (x instanceof Array) return [];
    if (x == null || x.length == 0) x = '정보 없음';
    return x;
}

function isLikeJob(likePerfumeList) {
    const likeMap = likePerfumeList.reduce((prev, cur) => {
        prev[cur.perfumeIdx] = true;
        return prev;
    }, {});
    return (obj) => {
        const ret = Object.assign({}, obj);
        ret.isLiked = likeMap[obj.perfumeIdx] ? true : false;
        return ret;
    };
}

function addKeyword(joinKeywordList) {
    const keywordMap = joinKeywordList.reduce((prev, cur) => {
        if (!prev[cur.perfumeIdx]) prev[cur.perfumeIdx] = [];
        prev[cur.perfumeIdx].push(cur.Keyword.name);
        return prev;
    }, {});

    return (obj) => {
        const ret = Object.assign({}, obj);
        ret.keywordList = keywordMap[obj.perfumeIdx] || [];
        return ret;
    };
}

const commonJob = [
    extractJob('Brand', ['name', 'brandName']),
    removeKeyJob(
        'perfume_idx',
        'englishName',
        'brandIdx',
        'createdAt',
        'updatedAt'
    ),
];

async function generateNote(perfumeIdx) {
    const noteList = await noteDao.readByPerfumeIdx(perfumeIdx);
    const noteDictDTO = NoteDictDTO.createByNoteList(noteList);
    const noteType = noteDictDTO.single.length > 0 ? 1 : 0;
    return { noteType, ingredients: noteDictDTO };
}

async function generateSummary(perfumeIdx) {
    const reviewList = await reviewDao.readAllOfPerfume(perfumeIdx);
    return PerfumeSummaryDTO.create(reviewList);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 향수 세부 정보 조회
 *
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @returns {Promise<Perfume>}
 **/
exports.getPerfumeById = async (perfumeIdx, userIdx) => {
    let _perfume = await perfumeDao.readByPerfumeIdx(perfumeIdx);
    const perfume = [...commonJob, flatJob('PerfumeDetail')].reduce(
        (prev, cur) => cur(prev),
        _perfume
    );
    perfume.abundanceRate = ABUNDANCE_RATE_LIST[perfume.abundanceRate];

    const likePerfume = await likePerfumeDao
        .read(userIdx, perfumeIdx)
        .then((it) => true)
        .catch((err) => {
            if (err instanceof NotMatchedError) {
                return false;
            }
            throw err;
        });
    perfume.isLiked = likePerfume ? true : false;
    perfume.Keywords = (await keywordDao.readAllOfPerfume(perfumeIdx)).map(
        (it) => it.name
    );
    perfume.volumeAndPrice = perfume.volumeAndPrice.map((it) => {
        return `${numberWithCommas(it.price)}/${it.volume}ml`;
    });

    delete perfume.imageUrl;
    perfume.imageUrls = await getImageList({
        Bucket: 'afume',
        Prefix: `perfume/${perfumeIdx}/`,
    }).then((it) => {
        if (!it.length) {
            console.log('Failed to read imageList from s3');
            return [];
        }
        return it
            .filter((it) => {
                return it.search(/\.jpg$|\.png$/i) > 0;
            })
            .map((it) => {
                return `${process.env.AWS_S3_URL}/${it}`;
            });
    });

    Object.assign(perfume, await generateNote(perfumeIdx));
    Object.assign(perfume, await generateSummary(perfumeIdx));
    for (const key in perfume) {
        if (!perfume[key] instanceof String) continue;
        perfume[key] = emptyCheck(perfume[key]);
    }
    return perfume;
};

/**
 * 향수 검색
 *
 * @param {number[]} brandIdxList
 * @param {number[]} ingredientIdxList
 * @param {number[]} keywordIdxList
 * @param {string} searchText
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @param {array} sort
 * @param {number} userIdx
 * @returns {Promise<Perfume[]>}
 **/
exports.searchPerfume = (
    brandIdxList,
    ingredientIdxList,
    keywordIdxList,
    searchText,
    pagingIndex,
    pagingSize,
    sort,
    userIdx
) => {
    const order = parseSortToOrder(sort);
    return perfumeDao
        .search(
            brandIdxList,
            ingredientIdxList,
            keywordIdxList,
            searchText,
            pagingIndex,
            pagingSize,
            order
        )
        .then(async (result) => {
            const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
            const likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
            updateRows(result, ...commonJob, isLikeJob(likePerfumeList));
            result.rows = result.rows.map((it) => new PerfumeThumbDTO(it));
            return result;
        });
};

/**
 * Survey 향수 조회
 *
 * @param {number} userIdx
 * @returns {Promise<Brand[]>}
 **/
exports.getSurveyPerfume = (userIdx) => {
    return userDao
        .readByIdx(userIdx)
        .then((it) => {
            return perfumeDao.readPerfumeSurvey(it.gender);
        })
        .then(async (result) => {
            const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
            const likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
            updateRows(result, ...commonJob);
            result.rows = result.rows.map((it) => new PerfumeThumbDTO(it));
            return result;
        });
};

/**
 * 향수 좋아요
 *
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @returns {Promise}
 **/
exports.likePerfume = (userIdx, perfumeIdx) => {
    return new Promise((resolve, reject) => {
        let exist = false;
        likePerfumeDao
            .read(userIdx, perfumeIdx)
            .then((res) => {
                exist = true;
                return likePerfumeDao.delete(userIdx, perfumeIdx);
            })
            .catch((err) => {
                exist = false;
                if (err instanceof NotMatchedError) {
                    return likePerfumeDao.create(userIdx, perfumeIdx);
                }
                reject(new FailedToCreateError());
            })
            .then(() => {
                resolve(!exist);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

/**
 * 유저의 최근 검색한 향수 조회
 *
 * @param {number} userIdx
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise<Perfume[]>}
 **/
exports.recentSearch = (userIdx, pagingIndex, pagingSize) => {
    return perfumeDao
        .recentSearchPerfumeList(userIdx, pagingIndex, pagingSize)
        .then(async (result) => {
            const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
            const likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
            updateRows(result, ...commonJob, isLikeJob(likePerfumeList));
            result.rows = result.rows.map((it) => new PerfumeThumbDTO(it));
            return result;
        });
};

/**
 * 유저 연령대 및 성별에 따른 향수 추천
 *
 * @param {number} userIdx
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise<Perfume[]>}
 **/
exports.recommendByUser = async (userIdx, pagingIndex, pagingSize) => {
    let ageGroup, gender;
    if (userIdx == -1) {
        gender = GENDER_WOMAN;
        ageGroup = 20;
    } else {
        const user = await userDao.readByIdx(userIdx);
        const today = new Date();
        const age = today.getFullYear() - user.birth + 1;
        gender = user.gender;
        ageGroup = parseInt(age / 10) * 10;
    }

    const recommendedList = this.recommendByGenderAgeAndGender(
        gender,
        ageGroup,
        pagingIndex,
        pagingSize
    );

    return recommendedList.then(async (result) => {
        const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
        let likePerfumeList = [];
        if (userIdx > -1) {
            likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
        }

        const joinKeywordList = await keywordDao.readAllOfPerfumeIdxList(
            perfumeIdxList
        );

        updateRows(
            result,
            ...commonJob,
            isLikeJob(likePerfumeList),
            addKeyword(joinKeywordList)
        );
        result.rows = result.rows.map((it) => new PerfumeThumbKeywordDTO(it));
        return result;
    });
};

/**
 * 유저 연령대 및 성별에 따른 향수 추천
 *
 * @param {number} gender
 * @param {number} ageGroup
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise<Perfume[]>}
 **/
exports.recommendByGenderAgeAndGender = (
    gender,
    ageGroup,
    pagingIndex,
    pagingSize
) => {
    return perfumeDao.recommendPerfumeByAgeAndGender(
        gender,
        ageGroup,
        pagingIndex,
        pagingSize
    );
};

/**
 * 새로 추가된 향수 조회
 *
 * @param {number} userIdx
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise<Perfume[]>}
 **/
exports.getNewPerfume = (userIdx, pagingIndex, pagingSize) => {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    return perfumeDao
        .readNewPerfume(fromDate, pagingIndex, pagingSize)
        .then(async (result) => {
            const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
            const likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
            updateRows(result, ...commonJob, isLikeJob(likePerfumeList));
            result.rows = result.rows.map((it) => new PerfumeThumbDTO(it));
            return result;
        });
};

/**
 * 유저가 좋아요한 향수 조회
 *
 * @param {number} userIdx
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise<Perfume[]>}
 **/
exports.getLikedPerfume = (userIdx, pagingIndex, pagingSize) => {
    return perfumeDao
        .readLikedPerfume(userIdx, pagingIndex, pagingSize)
        .then(async (result) => {
            const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
            const likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
            updateRows(result, ...commonJob, isLikeJob(likePerfumeList));
            result.rows = result.rows.map((it) => new PerfumeThumbDTO(it));
            return result;
        });
};

/**
 * 향수 idx값 조회
 *
 * @param {string} englishName
 * @returns {Promise<number>}
 **/
exports.findPerfumeIdxByEnglishName = (englishName) => {
    return perfumeDao.findPerfumeIdx({ englishName });
};

exports.setPerfumeDao = (dao) => {
    perfumeDao = dao;
};

exports.setReviewDao = (dao) => {
    reviewDao = dao;
};

exports.setNoteDao = (dao) => {
    noteDao = dao;
};

exports.setLikePerfumeDao = (dao) => {
    likePerfumeDao = dao;
};

exports.setKeywordDao = (dao) => {
    keywordDao = dao;
};

exports.setUserDao = (dao) => {
    userDao = dao;
};
