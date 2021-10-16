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

    static create(reviewList) {
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
                it.seasonal = SEASONAL_LIST[it.seasonal];
                it.sillage = SILLAGE_LIST[it.sillage];
                it.longevity = LONGEVITY_LIST[it.longevity];
                it.gender = GENDER_LIST[it.gender];
                return it;
            })
            .forEach(({ score, longevity, sillage, seasonal, gender }) => {
                if (score) {
                    sum += score;
                    cnt++;
                }
                longevityCountMap[longevity]++;
                sillageCountMap[sillage]++;
                seasonalCountMap[seasonal]++;
                genderCountMap[gender]++;
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
