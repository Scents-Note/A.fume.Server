'use strict';

const perfumeDao = require('../dao/PerfumeDao.js');
const reviewDao = require('../dao/ReviewDao.js');
const ingredientDao = require('../dao/IngredientDao.js');
const likePerfumeDao = require('../dao/LikePerfumeDao.js');
const keywordDao = require('../dao/KeywordDao.js');
const userDao = require('../dao/UserDao.js');
const { getImageList } = require('../lib/s3.js');

const { parseSortToOrder } = require('../utils/parser.js');

const { GENDER_WOMAN, abundanceRateArr } = require('../utils/code.js');

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
        'likeCnt',
        'updatedAt',
        'createdAt'
    ),
];

/**
 * 향수 정보 추가
 *
 * @param {Object} Perfume
 * @returns {Promise}
 **/
exports.createPerfume = ({
    brandIdx,
    name,
    englishName,
    volumeAndPrice,
    story,
    abundanceRate,
    imageUrl,
}) => {
    return perfumeDao.create({
        brandIdx,
        name,
        englishName,
        volumeAndPrice,
        imageUrl,
        story,
        abundanceRate,
    });
};

/**
 * 향수 삭제
 *
 * @param {number} perfumeIdx
 * @returns {Promise}
 **/
exports.deletePerfume = (perfumeIdx) => {
    return perfumeDao.delete(perfumeIdx);
};

const seasonalArr = ['spring', 'summer', 'fall', 'winter'];
const sillageArr = ['light', 'normal', 'heavy'];
const longevityArr = ['veryWeak', 'weak', 'medium', 'strong', 'veryStrong'];
const genderArr = ['male', 'neutral', 'female'];
const noteTypeArr = ['top', 'middle', 'base', 'single'];

function makeZeroMap(arr) {
    return arr.reduce((prev, cur) => {
        prev[cur] = 0;
        return prev;
    }, {});
}

function makeInitMap(arr, initFunc) {
    return arr.reduce((prev, cur) => {
        prev[cur] = initFunc();
        return prev;
    }, {});
}

function updateCount(obj, prop) {
    if (!obj[prop]) {
        obj[prop] = 0;
    }
    obj[prop] = obj[prop] + 1;
}

function normalize(obj) {
    const result = {};
    const entries = Object.entries(obj);
    const total = entries.reduce((prev, cur) => {
        return prev + cur[1];
    }, 0);
    if (total == 0) {
        return obj;
    }
    let remain = 100;
    let maxKey = 0;
    let max = 0;
    for (const [key, value] of entries) {
        result[key] = parseInt((parseFloat(value) / total) * 100);
        remain -= result[key];
        if (max < value) {
            max = value;
            maxKey = key;
        }
    }
    result[maxKey] += remain;
    return result;
}

async function generateNote(perfumeIdx) {
    const noteMap = (await ingredientDao.readByPerfumeIdx(perfumeIdx))
        .map((it) => {
            it.type = noteTypeArr[it.Notes.type - 1];
            delete it.Notes;
            return it;
        })
        .reduce(
            (prev, cur) => {
                let type = cur.type;
                prev[type].push(cur.name);
                return prev;
            },
            makeInitMap(noteTypeArr, () => [])
        );
    for (const key in noteMap) {
        if (!noteMap[key] instanceof Array) throw 'Invalid Type Exception';
        noteMap[key] = noteMap[key].join(', ');
    }
    const noteType = noteMap.single.length > 0 ? 1 : 0;
    return { noteType, ingredients: noteMap };
}

async function generateSummary(perfumeIdx) {
    let sum = 0,
        cnt = 0;
    let seasonalMap = makeZeroMap(seasonalArr);
    let sillageMap = makeZeroMap(sillageArr);
    let longevityMap = makeZeroMap(longevityArr);
    let genderMap = makeZeroMap(genderArr);

    (await reviewDao.readAllOfPerfume(perfumeIdx))
        .map((it) => {
            it.seasonal = seasonalArr[it.seasonal - 1];
            it.sillage = sillageArr[it.sillage - 1];
            it.longevity = longevityArr[it.longevity - 1];
            it.gender = genderArr[it.gender - 1];
            return it;
        })
        .forEach((review) => {
            if (review.score) {
                sum += review.score;
                cnt++;
                updateCount(longevityMap, review.longevity);
                updateCount(sillageMap, review.sillage);
                updateCount(seasonalMap, review.seasonal);
                updateCount(genderMap, review.gender);
            }
        });

    return {
        score: parseFloat((parseFloat(sum) / cnt).toFixed(2)) || 0,
        seasonal: normalize(seasonalMap),
        sillage: normalize(sillageMap),
        longevity: normalize(longevityMap),
        gender: normalize(genderMap),
    };
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
    perfume.abundanceRate = abundanceRateArr[perfume.abundanceRate];

    const likePerfumeList = await likePerfumeDao.read(userIdx, perfumeIdx);
    perfume.isLiked = likePerfumeList ? true : false;
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
            return updateRows(
                result,
                ...commonJob,
                removeKeyJob('SearchHistory', 'Score'),
                isLikeJob(likePerfumeList)
            );
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
            return updateRows(
                result,
                ...commonJob,
                removeKeyJob('PerfumeSurvey')
            );
        });
};

/**
 * 향수 정보 업데이트
 *
 * @param {Object} Perfume
 * @returns {Promise}
 **/
exports.updatePerfume = ({
    perfumeIdx,
    name,
    brandIdx,
    englishName,
    volumeAndPrice,
    imageThumbnailUrl,
    story,
    abundanceRate,
    imageUrl,
}) => {
    return perfumeDao.update({
        perfumeIdx,
        name,
        brandIdx,
        englishName,
        volumeAndPrice,
        imageThumbnailUrl,
        story,
        abundanceRate,
        imageUrl,
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
        let isExist = false;
        likePerfumeDao
            .read(userIdx, perfumeIdx)
            .then((res) => {
                isExist = true;
                return likePerfumeDao.delete(userIdx, perfumeIdx);
            })
            .catch((err) => {
                isExist = false;
                if (err instanceof NotMatchedError) {
                    return likePerfumeDao.create(userIdx, perfumeIdx);
                }
                reject(new FailedToCreateError());
            })
            .then(() => {
                resolve(!isExist);
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
            return updateRows(
                result,
                ...commonJob,
                removeKeyJob('SearchHistory'),
                isLikeJob(likePerfumeList)
            );
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

        return updateRows(
            result,
            ...commonJob,
            removeKeyJob('SearchHistory'),
            isLikeJob(likePerfumeList),
            addKeyword(joinKeywordList)
        );
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
            return updateRows(result, ...commonJob, isLikeJob(likePerfumeList));
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
            return updateRows(
                result,
                ...commonJob,
                removeKeyJob('LikePerfume')
            );
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
