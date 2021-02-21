'use strict';

const perfumeDao = require('../dao/PerfumeDao.js');
const reviewDao = require('../dao/ReviewDao.js');
const ingredientDao = require('../dao/IngredientDao.js');
const likePerfumeDao = require('../dao/LikePerfumeDao.js');
const searchHistoryDao = require('../dao/SearchHistoryDao.js');
const userDao = require('../dao/UserDao.js');

const { parseSortToOrder } = require('../utils/parser.js');

const {
    NotMatchedError,
    FailedToCreateError,
} = require('../utils/errors/errors.js');
async function updateIsLike(result, userIdx) {
    const perfumeList = result.rows;
    const perfumeIdxList = perfumeList.map((it) => it.perfumeIdx);
    const likePerfumeList = await likePerfumeDao.readLikeInfo(
        userIdx,
        perfumeIdxList
    );
    const likeMap = likePerfumeList.reduce((prev, cur) => {
        prev[cur] = true;
        return prev;
    }, {});
    result.rows = perfumeList.map((it) => {
        it.isLiked = likeMap[it.perfumeIdx] ? true : false;
        return it;
    });
    return result;
}

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
    imageThumbnailUrl,
    mainSeriesIdx,
    story,
    abundanceRate,
    imageUrl,
    releaseDate,
}) => {
    return perfumeDao.create({
        brandIdx,
        name,
        englishName,
        volumeAndPrice,
        imageThumbnailUrl,
        mainSeriesIdx,
        story,
        abundanceRate,
        imageUrl,
        releaseDate,
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
    if (!prop) return;
    obj[prop] = obj[prop] + 1;
}

function normalize(obj) {
    const result = {};
    const entries = Object.entries(obj);
    const total = entries.reduce((prev, cur) => {
        return prev + cur[1];
    }, 0);
    if (total == 0) {
        return entries.map((it) => {
            return 0;
        });
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

/**
 * 향수 세부 정보 조회
 *
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @returns {Promise<Perfume>}
 **/
exports.getPerfumeById = async (perfumeIdx, userIdx) => {
    const perfume = await perfumeDao.readByPerfumeIdx(perfumeIdx);

    const noteMap = (await ingredientDao.readByPerfumeIdx(perfumeIdx))
        .map((it) => {
            it.type = noteTypeArr[it.Notes.type - 1];
            delete it.Notes;
            return it;
        })
        .reduce(
            (prev, cur) => {
                let type = cur.type;
                delete cur.type;
                prev[type].push(cur);
                return prev;
            },
            makeInitMap(noteTypeArr, () => [])
        );

    let noteType;
    if (noteMap.single.length > 0) {
        noteType = 1;
        delete noteMap.top;
        delete noteMap.middle;
        delete noteMap.base;
    } else {
        noteType = 0;
        delete noteMap.single;
    }
    perfume.noteType = noteType;
    perfume.Notes = noteMap;

    let reviews = await reviewDao.readAllOrderByLike(perfumeIdx);
    let sum = 0,
        cnt = 0;
    let seasonal = makeZeroMap(seasonalArr);
    let sillage = makeZeroMap(sillageArr);
    let longevity = makeZeroMap(longevityArr);
    let gender = makeZeroMap(genderArr);
    reviews = reviews.map((it) => {
        it.seasonal = seasonalArr[it.seasonal - 1];
        it.sillage = sillageArr[it.sillage - 1];
        it.longevity = longevityArr[it.longevity - 1];
        it.gender = genderArr[it.gender - 1];
        return it;
    });

    for (const review of reviews) {
        if (review.score) {
            sum += review.score;
            cnt++;
            updateCount(longevity, review.longevity);
            updateCount(sillage, review.sillage);
            updateCount(seasonal, review.seasonal);
            updateCount(gender, review.gender);
        }
    }

    longevity = normalize(longevity);
    sillage = normalize(sillage);
    seasonal = normalize(seasonal);
    gender = normalize(gender);
    perfume.score = parseFloat((parseFloat(sum) / cnt).toFixed(2));
    perfume.seasonal = seasonal;
    perfume.sillage = sillage;
    perfume.longevity = longevity;
    perfume.gender = gender;

    if (userIdx > 0) searchHistoryDao.create(userIdx, perfumeIdx);
    return perfume;
};

/**
 * 향수 검색
 *
 * @param {Object} Filter
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @param {array} sort
 * @param {number} userIdx
 * @returns {Promise<Perfume[]>}
 **/
exports.searchPerfume = (filter, pagingIndex, pagingSize, sort, userIdx) => {
    const order = parseSortToOrder(sort);
    return perfumeDao
        .search(filter, pagingIndex, pagingSize, order)
        .then((result) => {
            result.rows.forEach((it) => {
                delete it.createdAt;
                delete it.updatedAt;
            });
            return updateIsLike(result, userIdx);
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
        .then((result) => {
            result.rows = result.rows.map((it) => {
                delete it.PerfumeSurvey;
                return it;
            });
            return updateIsLike(result, userIdx);
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
    mainSeriesIdx,
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
        mainSeriesIdx,
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
        .then((result) => {
            return updateIsLike(result, userIdx);
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
    const user = await userDao.readByIdx(userIdx);
    const today = new Date();
    const age = today.getFullYear() - user.birth + 1;
    const ageGroup = parseInt(age / 10) * 10;
    const cached = await perfumeDao.recommendPerfumeByAgeAndGenderCached();
    if (cached) {
        return updateIsLike(cached, userIdx);
    }
    return this.recommendByGenderAgeAndGender(
        user.gender,
        ageGroup,
        pagingIndex,
        pagingSize
    ).then((result) => {
        return updateIsLike(result, userIdx);
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
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise<Perfume[]>}
 **/
exports.getNewPerfume = (pagingIndex, pagingSize) => {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    return perfumeDao.readNewPerfume(fromDate, pagingIndex, pagingSize);
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
    return perfumeDao.readLikedPerfume(userIdx, pagingIndex, pagingSize);
};
