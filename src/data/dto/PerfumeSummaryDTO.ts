import {
    SEASONAL_LIST,
    SILLAGE_LIST,
    GENDER_LIST,
    LONGEVITY_LIST,
} from '@utils/constants';
import _, { isNumber } from 'lodash';

type SeasonalMap = {
    spring: number;
    summer: number;
    fall: number;
    winter: number;
};

type SillageMap = {
    light: number;
    medium: number;
    heavy: number;
};

type LongevityMap = {
    veryWeak: number;
    weak: number;
    normal: number;
    strong: number;
    veryStrong: number;
};

type GenderMap = {
    male: number;
    neutral: number;
    female: number;
};

type Longevity = keyof LongevityMap;
type Gender = keyof GenderMap;
type Sillage = keyof SillageMap;
type Seasonal = keyof SeasonalMap;

const FLOATING_POINT = 2;

function toFixedNumber(number: number): number {
    return parseFloat(number.toFixed(FLOATING_POINT));
}

class PerfumeSummaryDTO {
    readonly score: number;
    readonly seasonal: SeasonalMap;
    readonly sillage: SillageMap;
    readonly longevity: LongevityMap;
    readonly gender: GenderMap;
    constructor(
        score: number,
        seasonal: SeasonalMap,
        sillage: SillageMap,
        longevity: LongevityMap,
        gender: GenderMap
    ) {
        this.score = score;
        this.seasonal = seasonal;
        this.sillage = sillage;
        this.longevity = longevity;
        this.gender = gender;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByReviewList(reviewList: any[]): PerfumeSummaryDTO {
        const seasonalCountMap: SeasonalMap = {
            spring: 0,
            summer: 0,
            fall: 0,
            winter: 0,
        };
        const sillageCountMap: SillageMap = {
            light: 0,
            medium: 0,
            heavy: 0,
        };
        const longevityCountMap: LongevityMap = {
            veryWeak: 0,
            weak: 0,
            normal: 0,
            strong: 0,
            veryStrong: 0,
        };
        const genderCountMap: GenderMap = {
            male: 0,
            neutral: 0,
            female: 0,
        };

        const sum: number = _.chain(reviewList)
            .map((it) => it.score)
            .filter(isNumber)
            .sum()
            .value();
        const cnt: number = _.chain(reviewList)
            .map((it) => it.score)
            .filter(isNumber)
            .size()
            .value();
        reviewList
            .map((it: any) => {
                it.seasonal = SEASONAL_LIST[it.seasonal || 0];
                it.sillage = SILLAGE_LIST[it.sillage || 0];
                it.longevity = LONGEVITY_LIST[it.longevity || 0];
                it.gender = GENDER_LIST[it.gender || 0];
                return it;
            })
            .forEach(
                ({
                    longevity,
                    sillage,
                    seasonal,
                    gender,
                }: {
                    score: number;
                    longevity: Longevity;
                    sillage: Sillage;
                    seasonal: Seasonal;
                    gender: Gender;
                }) => {
                    if (longevity in longevityCountMap) {
                        longevityCountMap[longevity]++;
                    }
                    if (sillage in sillageCountMap) {
                        sillageCountMap[sillage]++;
                    }
                    if (seasonal in seasonalCountMap) {
                        seasonalCountMap[seasonal]++;
                    }
                    if (gender in genderCountMap) {
                        genderCountMap[gender]++;
                    }
                }
            );
        return new PerfumeSummaryDTO(
            cnt == 0 ? 0 : toFixedNumber(sum / cnt),
            <SeasonalMap>this.normalize(seasonalCountMap),
            <SillageMap>this.normalize(sillageCountMap),
            <LongevityMap>this.normalize(longevityCountMap),
            <GenderMap>this.normalize(genderCountMap)
        );
    }

    private static normalize(obj: { [key: string]: number }): {
        [key: string]: number;
    } {
        const entries: [string, number][] = Object.entries(obj);
        const total: number = _.sumBy(entries, (it) => it[1]);
        const result: { [key: string]: number } = _.mapValues(
            obj,
            (value: number) =>
                total != 0
                    ? Math.floor((value * 100) / total)
                    : Math.floor(100 / entries.length)
        );
        return result;
    }
}

export { PerfumeSummaryDTO };
