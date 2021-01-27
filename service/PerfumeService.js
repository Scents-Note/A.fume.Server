'use strict';

const perfumeDao = require('../dao/PerfumeDao.js');
const noteDao = require('../dao/NoteDao.js');
const reviewDao = require('../dao/ReviewDao.js');
const likeDao = require('../dao/LikeDao.js');
const searchHistoryDao = require('../dao/SearchHistoryDao.js');
const userDao = require('../dao/UserDao.js');

const { parseSortToOrder } = require('../utils/parser.js');

const {
    NotMatchedError,
    FailedToCreateError,
} = require('../utils/errors/errors.js');

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
    const perfume = await perfumeDao.readByPerfumeIdx(perfumeIdx, userIdx);

    let notes = await noteDao.read(perfumeIdx);
    notes = notes.map((it) => {
        it.type = noteTypeArr[it.type - 1];
        return it;
    });
    const ingredients = notes.reduce(
        (prev, cur) => {
            let type = cur.type;
            delete cur.type;
            prev[type].push(cur);
            return prev;
        },
        makeInitMap(noteTypeArr, () => {
            return [];
        })
    );

    let noteType;
    if (ingredients.single.length == notes.length) {
        noteType = 1;
        delete ingredients.top;
        delete ingredients.middle;
        delete ingredients.base;
    } else {
        noteType = 0;
        delete ingredients.single;
    }
    perfume.noteType = noteType;
    perfume.ingredients = ingredients;

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
 * @param {array} sort
 * @param {number} userIdx
 * @returns {Promise<Perfume[]>}
 **/
exports.searchPerfume = (filter, sort, userIdx) => {
    const order = parseSortToOrder(sort);
    return perfumeDao.search(filter, order, userIdx);
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
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @returns {Promise}
 **/
exports.likePerfume = (perfumeIdx, userIdx) => {
    return new Promise((resolve, reject) => {
        let isExist = false;
        likeDao
            .read(perfumeIdx, userIdx)
            .then((res) => {
                isExist = true;
                return likeDao.delete(perfumeIdx, userIdx);
            })
            .catch((err) => {
                isExist = false;
                if (err instanceof NotMatchedError) {
                    return likeDao.create(perfumeIdx, userIdx);
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
 * @returns {Promise<Perfume[]>}
 **/
exports.recentSearch = (userIdx) => {
    return perfumeDao.recentSearchPerfumeList(userIdx);
};

/**
 * 유저 연령대 및 성별에 따른 향수 추천
 *
 * @param {number} userIdx
 * @returns {Promise<Perfume[]>}
 **/
exports.recommendByUser = async (userIdx) => {
    const user = await userDao.readByIdx(userIdx);
    const today = new Date();
    const age = today.getFullYear() - user.birth + 1;
    const ageQuantize = parseInt(age / 10) * 10;
    const startYear = today.getFullYear() - ageQuantize - 8;
    const endYear = today.getFullYear() - ageQuantize + 1;
    return perfumeDao.recommendPerfumeByAgeAndGender(
        userIdx,
        user.gender,
        startYear,
        endYear
    );
};
