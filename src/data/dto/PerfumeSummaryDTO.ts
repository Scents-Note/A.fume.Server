import {
    SEASONAL_LIST,
    SILLAGE_LIST,
    GENDER_LIST,
    LONGEVITY_LIST,
} from '@utils/constants';

class PerfumeSummaryDTO {
    readonly score: number;
    readonly seasonal: number[];
    readonly sillage: number[];
    readonly longevity: number[];
    readonly gender: number[];
    constructor(
        score: number,
        seasonal: number[],
        sillage: number[],
        longevity: number[],
        gender: number[]
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
        const seasonalCountMap: { [key: string]: number } = {
            spring: 0,
            summer: 0,
            fall: 0,
            winter: 0,
        };
        const sillageCountMap: { [key: string]: number } = {
            light: 0,
            medium: 0,
            heavy: 0,
        };
        const longevityCountMap: { [key: string]: number } = {
            veryWeak: 0,
            weak: 0,
            normal: 0,
            strong: 0,
            veryStrong: 0,
        };
        const genderCountMap: { [key: string]: number } = {
            male: 0,
            neutral: 0,
            female: 0,
        };

        let sum: number = 0;
        let cnt: number = 0;
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
        return new PerfumeSummaryDTO(
            cnt == 0 ? 0 : parseFloat((sum / cnt).toFixed(2)),
            this.normalize(seasonalCountMap),
            this.normalize(sillageCountMap),
            this.normalize(longevityCountMap),
            this.normalize(genderCountMap)
        );
    }

    static createByDefault(defaultReviewDTO: any): PerfumeSummaryDTO {
        return new PerfumeSummaryDTO(
            defaultReviewDTO.rating,
            this.normalize(defaultReviewDTO.seasonal),
            this.normalize(defaultReviewDTO.sillage),
            this.normalize(defaultReviewDTO.longevity),
            this.normalize(defaultReviewDTO.gender)
        );
    }

    static merge(
        defaultSummary: PerfumeSummaryDTO,
        userSummary: PerfumeSummaryDTO,
        defaultRate: number
    ): PerfumeSummaryDTO {
        const merged: PerfumeSummaryDTO = Object.assign({}, userSummary);
        function calculate(defaultValue: number, userValue: number) {
            return userValue * (1 - defaultRate) + defaultValue * defaultRate;
        }
        const mergedScore = calculate(defaultSummary.score, merged.score);
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
        return new PerfumeSummaryDTO(
            mergedScore,
            this.normalize(merged.seasonal),
            this.normalize(merged.sillage),
            this.normalize(merged.longevity),
            this.normalize(merged.gender)
        );
    }

    private static normalize(obj: any) {
        const result: any = {};
        const entries: [string, number][] = Object.entries(obj);
        const total: number = entries.reduce(
            (prev: number, cur: [string, number]): number => {
                return prev + cur[1];
            },
            0
        );
        if (total == 0) {
            let remain: number = 100;
            for (let i = 0; i < entries.length - 1; i++) {
                const key: string = entries[i][0];
                obj[key] = Math.floor(100 / entries.length);
                remain -= obj[key];
            }
            obj[entries[entries.length - 1][0]] += remain;
            return obj;
        }
        let remain: number = 100;
        let maxKey: string = entries[0][0];
        let max: number = 0;
        for (const [key, value] of entries) {
            result[key] = Math.floor((value / total) * 100);
            remain -= result[key];
            if (max < value) {
                max = value;
                maxKey = key;
            }
        }
        result[maxKey] += remain;
        return result;
    }
}

export { PerfumeSummaryDTO };
