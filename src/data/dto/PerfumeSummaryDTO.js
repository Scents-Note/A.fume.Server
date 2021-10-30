'use strict';

const {
    SEASONAL_LIST,
    SILLAGE_LIST,
    GENDER_LIST,
    LONGEVITY_LIST,
} = require('../../utils/constantUtil.js');

class PerfumeSummaryDTO {
    constructor({ score, seasonal, sillage, longevity, gender }) {
        this.score = score;
        this.seasonal = seasonal;
        this.sillage = sillage;
        this.longevity = longevity;
        this.gender = gender;
    }

    static createByReviewList(reviewList) {
        const seasonalCountMap = {
            spring: 0,
            summer: 0,
            fall: 0,
            winter: 0,
        };
        const sillageCountMap = {
            light: 0,
            medium: 0,
            heavy: 0,
        };
        const longevityCountMap = {
            veryWeak: 0,
            weak: 0,
            normal: 0,
            strong: 0,
            veryStrong: 0,
        };
        const genderCountMap = {
            male: 0,
            neutral: 0,
            female: 0,
        };

        let sum = 0,
            cnt = 0;
        reviewList
            .map((it) => {
                it.seasonal = SEASONAL_LIST[it.seasonal || 0];
                it.sillage = SILLAGE_LIST[it.sillage || 0];
                it.longevity = LONGEVITY_LIST[it.longevity || 0];
                it.gender = GENDER_LIST[it.gender || 0];
                return it;
            })
            .forEach(({ score, longevity, sillage, seasonal, gender }) => {
                if (score) {
                    sum += score;
                    cnt++;
                }
                if (longevityCountMap[longevity]) {
                    longevityCountMap[longevity]++;
                }
                if (sillageCountMap[sillage]) {
                    sillageCountMap[sillage]++;
                }
                if (seasonalCountMap[seasonal]) {
                    seasonalCountMap[seasonal]++;
                }
                if (genderCountMap[gender]) {
                    genderCountMap[gender]++;
                }
            });
        return {
            score:
                cnt == 0 ? 0 : parseFloat((parseFloat(sum) / cnt).toFixed(2)),
            seasonal: normalize(seasonalCountMap),
            sillage: normalize(sillageCountMap),
            longevity: normalize(longevityCountMap),
            gender: normalize(genderCountMap),
        };
    }

    static createByDefault(defaultReviewDTO) {
        return {
            score: defaultReviewDTO.rating,
            seasonal: normalize(defaultReviewDTO.seasonal),
            sillage: normalize(defaultReviewDTO.sillage),
            longevity: normalize(defaultReviewDTO.longevity),
            gender: normalize(defaultReviewDTO.gender),
        };
    }

    static merge(defaultSummary, userSummary, defaultRate) {
        const merged = Object.assign({}, userSummary);
        function calculate(defaultValue, userValue) {
            return userValue * (1 - defaultRate) + defaultValue * defaultRate;
        }
        merged.score = calculate(defaultSummary.score, merged.score);
        for (let key in merged.seasonal) {
            merged.seasonal[key] = calculate(
                defaultSummary.seasonal[key],
                merged.seasonal[key]
            );
        }
        for (let key in merged.longevity) {
            merged.longevity[key] = calculate(
                defaultSummary.longevity[key],
                merged.longevity[key]
            );
        }
        for (let key in merged.sillage) {
            merged.sillage[key] = calculate(
                defaultSummary.sillage[key],
                merged.sillage[key]
            );
        }
        for (let key in merged.gender) {
            merged.gender[key] = calculate(
                defaultSummary.gender[key],
                merged.gender[key]
            );
        }
        return {
            score: merged.score,
            seasonal: normalize(merged.seasonal),
            sillage: normalize(merged.sillage),
            longevity: normalize(merged.longevity),
            gender: normalize(merged.gender),
        };
    }
}

module.exports = PerfumeSummaryDTO;

function normalize(obj) {
    const result = {};
    const entries = Object.entries(obj);
    const total = entries.reduce((prev, cur) => {
        return prev + cur[1];
    }, 0);
    if (total == 0) {
        let remain = 100;
        for (let i = 0; i < entries.length - 1; i++) {
            const key = entries[i][0];
            obj[key] = parseInt(100 / entries.length);
            remain -= obj[key];
        }
        obj[entries[entries.length - 1][0]] += remain;
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
