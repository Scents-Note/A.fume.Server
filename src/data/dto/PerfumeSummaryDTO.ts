import _ from 'lodash';
import {
    ReviewProperty,
    ScoreProperty,
    AverageStrategy,
    SeasonalProperty,
    SeasonalNormalizeStrategy,
    LongevityProperty,
    LongevityNormalizeStrategy,
    SillageProperty,
    SillageNormalizeStrategy,
    GenderProperty,
    GenderNormalizeStrategy,
} from '../vo/ReviewProperty';

class PerfumeSummaryDTO {
    readonly score: number;
    readonly seasonal: { [key: string]: number };
    readonly sillage: { [key: string]: number };
    readonly longevity: { [key: string]: number };
    readonly gender: { [key: string]: number };
    constructor(
        score: number,
        seasonal: { [key: string]: number },
        sillage: { [key: string]: number },
        longevity: { [key: string]: number },
        gender: { [key: string]: number }
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
        const score: number = this.getAverageScore(reviewList);
        const normalizeSeasonal: { [key: string]: number } =
            this.getNormalizeSeasonal(reviewList);
        const normalizeSillage: { [key: string]: number } =
            this.getNormalizeSillage(reviewList);
        const normalizeLongevity: { [key: string]: number } =
            this.getNormalizeLongevity(reviewList);
        const normalizeGender: { [key: string]: number } =
            this.getNormalizeGender(reviewList);

        return new PerfumeSummaryDTO(
            score,
            normalizeSeasonal,
            normalizeSillage,
            normalizeLongevity,
            normalizeGender
        );
    }

    private static getAverageScore(reviewList: any[]): number {
        return new AverageStrategy().calculate(
            reviewList.map((it: any) => ScoreProperty.getIntance(it.score))
        );
    }

    private static getNormalizeSeasonal(reviewList: any[]): {
        [key: string]: number;
    } {
        const properties: ReviewProperty[] = reviewList.flatMap((it: any) =>
            SeasonalProperty.getIntances(it.seasonal || 0)
        );
        const strategy: SeasonalNormalizeStrategy =
            new SeasonalNormalizeStrategy();
        return strategy.calculate(properties);
    }

    private static getNormalizeSillage(reviewList: any[]): {
        [key: string]: number;
    } {
        const properties: ReviewProperty[] = reviewList.map((it: any) =>
            SillageProperty.getIntance(it.sillage || 0)
        );
        const strategy: SillageNormalizeStrategy =
            new SillageNormalizeStrategy();
        return strategy.calculate(properties);
    }

    private static getNormalizeLongevity(reviewList: any[]): {
        [key: string]: number;
    } {
        const properties: ReviewProperty[] = reviewList.map((it: any) =>
            LongevityProperty.getIntance(it.longevity || 0)
        );
        const strategy: LongevityNormalizeStrategy =
            new LongevityNormalizeStrategy();
        return strategy.calculate(properties);
    }

    private static getNormalizeGender(reviewList: any[]): {
        [key: string]: number;
    } {
        const properties: ReviewProperty[] = reviewList.map((it: any) =>
            GenderProperty.getIntance(it.gender || 0)
        );
        const strategy: GenderNormalizeStrategy = new GenderNormalizeStrategy();
        return strategy.calculate(properties);
    }
}

export { PerfumeSummaryDTO };
