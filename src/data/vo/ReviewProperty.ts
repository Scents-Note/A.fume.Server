import _, { isNumber } from 'lodash';

import {
    NONE,
    VERY_WEAK,
    WEAK,
    NORMAL,
    STRONG,
    VERY_STRONG,
    SPRING,
    SUMMER,
    FALL,
    WINTER,
    LIGHT,
    MEDIUM,
    HEAVY,
    MALE,
    NEUTRAL,
    FEMALE,
} from '@utils/strings';

class ReviewProperty {
    static none = new ReviewProperty(0, NONE);
    readonly value: number;
    readonly name: string;
    constructor(value: number, name: string) {
        this.value = value;
        this.name = name;
    }
}

class ScoreProperty extends ReviewProperty {
    private constructor(value: number) {
        super(value, '★' + value.toFixed(2));
    }

    public static getIntance(value: number): LongevityProperty {
        return new ScoreProperty(value);
    }
}
class SeasonalProperty extends ReviewProperty {
    public static readonly spring: ReviewProperty = new SeasonalProperty(
        1 << 0,
        SPRING
    );
    public static readonly summer: ReviewProperty = new SeasonalProperty(
        1 << 1,
        SUMMER
    );
    public static readonly fall: ReviewProperty = new SeasonalProperty(
        1 << 2,
        FALL
    );
    public static readonly winter: ReviewProperty = new SeasonalProperty(
        1 << 3,
        WINTER
    );

    private constructor(value: number, name: string) {
        super(value, name);
    }

    public static getIntances(value: number): ReviewProperty[] {
        return [
            SeasonalProperty.spring,
            SeasonalProperty.summer,
            SeasonalProperty.fall,
            SeasonalProperty.winter,
        ].filter((it) => {
            return (it.value & value) > 0;
        });
    }
}

class SillageProperty extends ReviewProperty {
    public static readonly light: ReviewProperty = new SillageProperty(
        1,
        LIGHT
    );
    public static readonly medium: ReviewProperty = new SillageProperty(
        2,
        MEDIUM
    );
    public static readonly heavy: ReviewProperty = new SillageProperty(
        3,
        HEAVY
    );

    public static readonly sillages: ReviewProperty[] = [
        this.none,
        this.light,
        this.medium,
        this.heavy,
    ];

    private constructor(value: number, name: string) {
        super(value, name);
    }

    public static getIntance(value: number): ReviewProperty {
        return SillageProperty.sillages[parseInt(value.toFixed())];
    }
}

class LongevityProperty extends ReviewProperty {
    public static readonly veryWeak: ReviewProperty = new LongevityProperty(
        1,
        VERY_WEAK
    );
    public static readonly weak: ReviewProperty = new LongevityProperty(
        2,
        WEAK
    );
    public static readonly normal: ReviewProperty = new LongevityProperty(
        3,
        NORMAL
    );
    public static readonly strong: ReviewProperty = new LongevityProperty(
        4,
        STRONG
    );
    public static readonly veryStrong: ReviewProperty = new LongevityProperty(
        5,
        VERY_STRONG
    );

    public static readonly longevities: ReviewProperty[] = [
        this.none,
        this.veryWeak,
        this.weak,
        this.normal,
        this.strong,
        this.veryStrong,
    ];

    private constructor(value: number, name: string) {
        super(value, name);
    }

    public static getIntance(value: number): LongevityProperty {
        return LongevityProperty.longevities[parseInt(value.toFixed())];
    }
}

class GenderProperty extends ReviewProperty {
    public static readonly male: ReviewProperty = new GenderProperty(1, MALE);
    public static readonly neutral: ReviewProperty = new GenderProperty(
        2,
        NEUTRAL
    );
    public static readonly female: ReviewProperty = new GenderProperty(
        3,
        FEMALE
    );

    public static readonly genders: ReviewProperty[] = [
        this.none,
        this.male,
        this.neutral,
        this.female,
    ];

    private constructor(value: number, name: string) {
        super(value, name);
    }

    public static getIntance(value: number): GenderProperty {
        return GenderProperty.genders[parseInt(value.toFixed())];
    }
}
abstract class NormalizeCounterStrategy {
    calculate(properties: ReviewProperty[]): { [key: string]: number } {
        const _count: { [key: string]: number } = _.chain(properties)
            .countBy((it) => it.name)
            .value();

        const counter: { [key: string]: number } = _.chain(
            this.getPropertyKeys()
        )
            .keyBy((it: string) => it)
            .mapValues((it: string) => _count[it] || 0)
            .value();
        return NormalizeCounterStrategy.normalize(counter);
    }

    abstract getPropertyKeys(): string[];

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

class AverageStrategy {
    calculate(properties: ReviewProperty[]): number {
        const sum: number = _.chain(properties)
            .filter((it: ReviewProperty) => it != ReviewProperty.none)
            .map((it: ReviewProperty) => it.value)
            .filter(isNumber)
            .sum()
            .value();
        const size: number = properties.length;
        return size == 0 ? 0 : AverageStrategy.toFixedNumber(sum / size);
    }

    private static FLOATING_POINT = 2;

    private static toFixedNumber(number: number): number {
        return parseFloat(number.toFixed(AverageStrategy.FLOATING_POINT));
    }
}

class LongevityNormalizeStrategy extends NormalizeCounterStrategy {
    getPropertyKeys(): string[] {
        return LongevityProperty.longevities
            .filter((it: ReviewProperty) => it != ReviewProperty.none)
            .map((it) => it.name);
    }
}

class SeasonalNormalizeStrategy extends NormalizeCounterStrategy {
    getPropertyKeys(): string[] {
        return [SPRING, SUMMER, FALL, WINTER];
    }
}

class SillageNormalizeStrategy extends NormalizeCounterStrategy {
    getPropertyKeys(): string[] {
        return SillageProperty.sillages
            .filter((it: ReviewProperty) => it != ReviewProperty.none)
            .map((it) => it.name);
    }
}

class GenderNormalizeStrategy extends NormalizeCounterStrategy {
    getPropertyKeys(): string[] {
        return GenderProperty.genders
            .filter((it: ReviewProperty) => it != ReviewProperty.none)
            .map((it) => it.name);
    }
}

export {
    ReviewProperty,
    ScoreProperty,
    AverageStrategy,
    SeasonalProperty,
    SeasonalNormalizeStrategy,
    SillageProperty,
    SillageNormalizeStrategy,
    LongevityProperty,
    LongevityNormalizeStrategy,
    GenderProperty,
    GenderNormalizeStrategy,
};
