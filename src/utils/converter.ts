import { logger } from '@modules/winston';

import { InvalidValueError } from '@errors';

const seasonalTypeArr = ['봄', '여름', '가을', '겨울'];

// TODO converter가 특정 dao에 의존하는 것은 불필요한 의존성을 만드는 거 같네요.
import KeywordDao from '@dao/KeywordDao';
const keywordDao = new KeywordDao();

const INSTEAD_NULL_VALUE = -1;

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
export const InputIntToDBIntOfReview = async ({
    longevity,
    sillage,
    seasonalList,
    gender,
    keywordList,
}: {
    longevity: number;
    sillage: number;
    seasonalList: string[];
    gender: number;
    keywordList: (string | number)[];
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
        let keywordIdxList = [];
        if (keywordList) {
            keywordIdxList = await Promise.all(
                keywordList.map((it) => {
                    if (typeof it == 'number') {
                        return it;
                    } else if (typeof it == 'string') {
                        return keywordDao.readKeywordIdx(it);
                    } else {
                        throw new InvalidValueError();
                    }
                })
            );
        }

        return {
            longevity: longevity + 1 ? longevity + 1 : 0,
            sillage: sillage + 1 ? sillage + 1 : 0,
            sumOfBitSeasonal: seasonalList && sum && sum > 0 ? sum : 0,
            gender: gender + 1 ? gender + 1 : 0,
            keywordList: keywordIdxList,
        };
    } catch (err) {
        logger.error(err);
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
export const DBIntToOutputIntOfReview = ({
    longevity,
    sillage,
    sumOfBitSeasonal,
    gender,
}: {
    longevity: number | null;
    sillage: number | null;
    sumOfBitSeasonal: number | null;
    gender: number | null;
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
        logger.error(err);
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
export const getApproxAge = (birthYear: number) => {
    const thisYear = new Date().getFullYear();
    const exactAge = thisYear - birthYear + 1;
    const exactAgeTens = parseInt(String(exactAge / 10)) * 10;
    const exactAgeUnit = exactAge % 10;

    let section;
    if (exactAgeUnit < 4) section = '초반';
    else if (exactAgeUnit >= 4 && exactAgeUnit < 7) section = '중반';
    else section = '후반';

    return `${exactAgeTens}대 ${section}`;
};
