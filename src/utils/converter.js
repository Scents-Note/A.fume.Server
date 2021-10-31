const seasonalTypeArr = ['봄', '여름', '가을', '겨울'];
const sillageTypeArr = ['가벼움', '보통', '무거움'];
const longevityTypeArr = ['매우 약함', '약함', '보통', '강함', '매우 강함'];
const genderTypeArr = ['남성', '중성', '여성'];

const { InvalidValueError } = require('./errors/errors.js');
const KeywordDao = require('../dao/KeywordDao');

const INSTEAD_NULL_VALUE = -1;

/**
 * 인풋 데이터 타입이 str인데 DB에는 int로 변환해서 저장해야하는 경우 사용
 * @param {Object} Review
 * @param {string} Review.longevity
 * @param {string} Review.sillage
 * @example <caption> An Example of sillage </caption>
 * // returns { sillage: 1 }
 * inputStrToDBIntOfReview({ sillage: '가벼움' })
 * @param {string} Review.gender
 * @param {string[]} Review.seasonalList
 * @param {integer[]|string[]} Review.keywordList
 * @returns {Promise<Review>}
 */
module.exports.inputStrToDBIntOfReview = async ({
    longevity,
    sillage,
    seasonalList,
    gender,
    keywordList,
}) => {
    try {
        // seasonalList 변환하기 (비트연산)
        let sum;
        if (seasonalList) {
            sum = seasonalList.reduce((acc, it) => {
                const bit = 2 ** seasonalTypeArr.indexOf(it);
                return acc + bit;
            }, 0);
        }

        // keywordList 변환하기
        let keywordIdxList;
        if (keywordList) {
            keywordIdxList = await Promise.all(
                keywordList.map((it) => {
                    if (typeof it == 'number') {
                        return it;
                    } else if (typeof it == 'string') {
                        return KeywordDao.readKeywordIdx(it);
                    } else {
                        throw new InvalidValueError();
                    }
                })
            );
        }

        return {
            longevity: longevity
                ? longevityTypeArr.indexOf(longevity) + 1
                : null,
            sillage: sillage ? sillageTypeArr.indexOf(sillage) + 1 : null,
            sumOfBitSeasonal: seasonalList ? sum : null,
            gender: gender ? genderTypeArr.indexOf(gender) + 1 : null,
            keywordList: keywordList ? keywordIdxList : [],
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * DB 데이터 타입이 int인데 매칭되는 str로 변환해서 반환해야하는 경우 사용
 * @param {Object} Review
 * @param {number} Review.longevity
 * @param {number} Review.sillage
 * @example <caption> An Example of sillage </caption>
 * // returns { sillage: '가벼움' }
 * DBIntToOutputStrOfReview({ sillage: 1 })
 * @param {number} Review.gender
 * @param {number} Review.sumOfBitSeasonal
 * @returns {Promise<Review>}
 */
module.exports.DBIntToOutputStrOfReview = async ({
    longevity,
    sillage,
    sumOfBitSeasonal,
    gender,
}) => {
    try {
        // seasonalList 변환하기 (비트연산)
        let seasonalStrList = [];
        if (sumOfBitSeasonal) {
            for (let i = 0; i < 4; i++) {
                if (sumOfBitSeasonal & (2 ** i)) {
                    seasonalStrList.push(seasonalTypeArr[i]);
                }
            }
        }

        return {
            longevity: longevity
                ? longevityTypeArr[longevity - 1]
                : INSTEAD_NULL_VALUE,
            sillage: sillage ? sillageTypeArr[sillage - 1] : INSTEAD_NULL_VALUE,
            seasonalList: sumOfBitSeasonal ? seasonalStrList : [],
            gender: gender ? genderTypeArr[gender - 1] : INSTEAD_NULL_VALUE,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * 인풋 데이터 DB 데이터 타입은 같지만, 저장 규칙이 서로 달라 인풋 데이터 변환이 필요한 경우 사용
 * @param {Object} Review
 * @param {number} Review.longevity
 * @param {number} Review.sillage
 * @example <caption> An Example of sillage </caption>
 * // returns { sillage: 1 }
 * InputIntToDBIntOfReview({ sillage: 0 })
 * @param {number} Review.gender
 * @param {string[]} Review.seasonalList
 * @param {string[]|integer[]} Review.keywordList
 * @returns {Promise<Review>}
 */
module.exports.InputIntToDBIntOfReview = async ({
    longevity,
    sillage,
    seasonalList,
    gender,
    keywordList,
}) => {
    try {
        // seasonalList 변환하기 (비트연산)
        let sum;
        if (seasonalList) {
            sum = seasonalList.reduce((acc, it) => {
                const bit = 2 ** seasonalTypeArr.indexOf(it);
                return acc + bit;
            }, 0);
        }

        // keywordList 변환하기
        let keywordIdxList;
        if (keywordList) {
            keywordIdxList = await Promise.all(
                keywordList.map((it) => {
                    if (typeof it == 'number') {
                        return it;
                    } else if (typeof it == 'string') {
                        return KeywordDao.readKeywordIdx(it);
                    } else {
                        throw new InvalidValueError();
                    }
                })
            );
        }

        return {
            longevity: longevity + 1 ? longevity + 1 : null,
            sillage: sillage + 1 ? sillage + 1 : null,
            sumOfBitSeasonal: seasonalList && sum > 0 ? sum : null,
            gender: gender + 1 ? gender + 1 : null,
            keywordList: keywordList ? keywordIdxList : [],
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * 인풋 데이터와 DB 데이터 타입은 같지만, 저장 규칙이 서로 달라 DB 데이터 변환이 필요한 경우 사용
 * @param {Object} Review
 * @param {number} Review.longevity
 * @param {number} Review.sillage
 * @example <caption> An Example of sillage </caption>
 * // returns { sillage: 0 }
 * DBIntToOutputIntOfReview({ sillage: 1 })
 * @param {number} Review.gender
 * @param {number} Review.sumOfBitSeasonal
 * @returns {Promise<Review>}
 */
module.exports.DBIntToOutputIntOfReview = async ({
    longevity,
    sillage,
    sumOfBitSeasonal,
    gender,
}) => {
    try {
        // seasonalList 변환하기 (비트연산)
        let seasonalStrList = [];
        if (sumOfBitSeasonal) {
            for (let i = 0; i < 4; i++) {
                if (sumOfBitSeasonal & (2 ** i)) {
                    seasonalStrList.push(seasonalTypeArr[i]);
                }
            }
        }

        return {
            longevity: longevity ? longevity - 1 : INSTEAD_NULL_VALUE,
            sillage: sillage ? sillage - 1 : INSTEAD_NULL_VALUE,
            seasonalList: sumOfBitSeasonal ? seasonalStrList : [],
            gender: gender ? gender - 1 : INSTEAD_NULL_VALUE,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * 생년월일을 대략적인 나이대로 변환
 * @param {number} birthYear
 * @example <caption> An Example of birthYear </caption>
 * // returns '20대 초반'
 * getApproxAge(1999)
 * @returns {string} approxAge
 */
module.exports.getApproxAge = (birthYear) => {
    const thisYear = new Date().getFullYear();
    const exactAge = thisYear - birthYear + 1;
    const exactAgeTens = parseInt(exactAge / 10) * 10;
    const exactAgeUnit = exactAge % 10;

    let section;
    if (exactAgeUnit < 4) section = '초반';
    else if (exactAgeUnit >= 4 && exactAgeUnit < 7) section = '중반';
    else section = '후반';

    return `${exactAgeTens}대 ${section}`;
};
