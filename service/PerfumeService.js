'use strict';

let perfumeDao = require('../dao/PerfumeDao.js');
let reviewDao = require('../dao/ReviewDao.js');
let noteDao = require('../dao/NoteDao');
let likePerfumeDao = require('../dao/LikePerfumeDao.js');
let keywordDao = require('../dao/KeywordDao.js');
let userDao = require('../dao/UserDao.js');
let s3FileDao = require('../dao/S3FileDao.js');

const {
    GENDER_WOMAN,
    NOTE_TYPE_SINGLE,
    NOTE_TYPE_NORMAL,
} = require('../utils/constantUtil.js');

const {
    NoteDictDTO,
    PerfumeSummaryDTO,
    PerfumeThumbDTO,
    PerfumeThumbKeywordDTO,
    PerfumeIntegralDTO,
    ListAndCountDTO,
    PagingDTO,
    PerfumeSearchDTO,
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
    const noteType =
        noteDictDTO.single.length > 0 ? NOTE_TYPE_SINGLE : NOTE_TYPE_NORMAL;
    return { noteType, noteDictDTO };
}

async function generateSummary(perfumeIdx) {
    const reviewList = await reviewDao.readAllOfPerfume(perfumeIdx);
    return PerfumeSummaryDTO.create(reviewList);
}

function isLike({ userIdx, perfumeIdx }) {
    return likePerfumeDao
        .read(userIdx, perfumeIdx)
        .then((it) => true)
        .catch((err) => {
            if (err instanceof NotMatchedError) {
                return false;
            }
            throw err;
        });
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

    perfume.isLiked = await isLike({ userIdx, perfumeIdx });
    const keywordList = (await keywordDao.readAllOfPerfume(perfumeIdx)).map(
        (it) => it.name
    );

    const imageUrls = await s3FileDao.getS3ImageList(perfumeIdx);
    const { noteType, noteDictDTO } = await generateNote(perfumeIdx);
    const perfumeSummaryDTO = await generateSummary(perfumeIdx);

    for (const key in perfume) {
        if (!perfume[key] instanceof String) continue;
        perfume[key] = emptyCheck(perfume[key]);
    }
    return PerfumeIntegralDTO.create({
        perfumeDTO: perfume,
        keywordList,
        perfumeSummaryDTO,
        noteDictDTO,
        noteType,
        imageUrls,
    });
};

/**
 * 향수 검색
 *
 * @param {PerfumeSearchRequestDTO} perfumeSearchRequestDTO
 * @param {PagingRequestDTO} pagingRequestDTO
 * @returns {Promise<Perfume[]>}
 **/
exports.searchPerfume = ({ perfumeSearchRequestDTO, pagingRequestDTO }) => {
    const { pagingIndex, pagingSize, order } =
        PagingDTO.create(pagingRequestDTO);
    const {
        brandIdxList,
        ingredientIdxList,
        keywordIdxList,
        searchText,
        userIdx,
    } = PerfumeSearchDTO.create(perfumeSearchRequestDTO);
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
            return new ListAndCountDTO({
                count: result.count,
                rows: result.rows.map((it) => new PerfumeThumbDTO(it)),
            });
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
            updateRows(result, ...commonJob, isLikeJob(likePerfumeList));
            return new ListAndCountDTO({
                count: result.count,
                rows: result.rows.map((it) => new PerfumeThumbDTO(it)),
            });
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
 * @param {PagingRequestDTO} pagingRequestDTO
 * @returns {Promise<Perfume[]>}
 **/
exports.recentSearch = ({ userIdx, pagingRequestDTO }) => {
    const { pagingIndex, pagingSize } = PagingDTO.create(pagingRequestDTO);
    return perfumeDao
        .recentSearchPerfumeList(userIdx, pagingIndex, pagingSize)
        .then(async (result) => {
            const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
            const likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
            updateRows(result, ...commonJob, isLikeJob(likePerfumeList));
            return new ListAndCountDTO({
                count: result.count,
                rows: result.rows.map((it) => new PerfumeThumbDTO(it)),
            });
        });
};

/**
 * 유저 연령대 및 성별에 따른 향수 추천
 *
 * @param {number} userIdx
 * @param {number} pagingRequestDTO
 * @returns {Promise<Perfume[]>}
 **/
exports.recommendByUser = async ({ userIdx, pagingRequestDTO }) => {
    const { pagingIndex, pagingSize } = PagingDTO.create(pagingRequestDTO);
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
        return new ListAndCountDTO({
            count: result.count,
            rows: result.rows.map((it) => new PerfumeThumbDTO(it)),
        });
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
    pagingRequestDTO
) => {
    const { pagingIndex, pagingSize } = PagingDTO.create(pagingRequestDTO);
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
 * @param {number} pagingRequestDTO
 * @returns {Promise<Perfume[]>}
 **/
exports.getNewPerfume = ({ userIdx, pagingRequestDTO }) => {
    const { pagingIndex, pagingSize } = PagingDTO.create(pagingRequestDTO);
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
            return new ListAndCountDTO({
                count: result.count,
                rows: result.rows.map((it) => new PerfumeThumbDTO(it)),
            });
        });
};

/**
 * 유저가 좋아요한 향수 조회
 *
 * @param {number} userIdx
 * @param {number} pagingRequestDTO
 * @returns {Promise<Perfume[]>}
 **/
exports.getLikedPerfume = ({ userIdx, pagingRequestDTO }) => {
    const { pagingIndex, pagingSize } = PagingDTO.create(pagingRequestDTO);
    return perfumeDao
        .readLikedPerfume(userIdx, pagingIndex, pagingSize)
        .then(async (result) => {
            const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
            const likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
            updateRows(result, ...commonJob, isLikeJob(likePerfumeList));
            return new ListAndCountDTO({
                count: result.count,
                rows: result.rows.map((it) => new PerfumeThumbDTO(it)),
            });
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

exports.setS3FileDao = (dao) => {
    s3FileDao = dao;
};
