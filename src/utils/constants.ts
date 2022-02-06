import {
    NONE,
    COLOGNE,
    EAU_DE_COLOGNE,
    EAU_DE_TOILETTE,
    EAU_DE_PERFUME,
    PERFUME,
    ETC,
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
    TOP,
    MIDDLE,
    BASE,
    SINGLE,
    VERY_WEAK,
    WEAK,
    NORMAL,
    STRONG,
    VERY_STRONG,
} from '@utils/strings';

const GENDER_MAN: number = 1;
const GENDER_WOMAN: number = 2;
const GRADE_USER: number = 0;
const GRADE_MANAGER: number = 1;
const GRADE_SYSTEM_ADMIN: number = 9;
const ABUNDANCE_RATE_LIST: string[] = [
    NONE,
    COLOGNE,
    EAU_DE_COLOGNE,
    EAU_DE_TOILETTE,
    EAU_DE_PERFUME,
    PERFUME,
    ETC,
];
const NOTE_TYPE_TOP: number = 1;
const NOTE_TYPE_MIDDLE: number = 2;
const NOTE_TYPE_BASE: number = 3;
const NOTE_TYPE_SINGLE: number = 4;
const SEASONAL_LIST: string[] = [NONE, SPRING, SUMMER, FALL, WINTER];
const SILLAGE_LIST: string[] = [NONE, LIGHT, MEDIUM, HEAVY];
const LONGEVITY_LIST: string[] = [
    NONE,
    VERY_WEAK,
    WEAK,
    NORMAL,
    STRONG,
    VERY_STRONG,
];
const GENDER_LIST: string[] = [NONE, MALE, NEUTRAL, FEMALE];
const NOTE_TYPE_LIST: string[] = [NONE, TOP, MIDDLE, BASE, SINGLE];
const PERFUME_NOTE_TYPE_SINGLE: number = 1;
const PERFUME_NOTE_TYPE_NORMAL: number = 0;
const MIN_SCORE: number = 0;
const MAX_SCORE: number = 10;
const DEFAULT_REVIEW_THRESHOLD: number = 10;

export {
    GENDER_MAN,
    GENDER_WOMAN,
    GRADE_USER,
    GRADE_MANAGER,
    GRADE_SYSTEM_ADMIN,
    ABUNDANCE_RATE_LIST,
    NOTE_TYPE_TOP,
    NOTE_TYPE_MIDDLE,
    NOTE_TYPE_BASE,
    NOTE_TYPE_SINGLE,
    SEASONAL_LIST,
    SILLAGE_LIST,
    LONGEVITY_LIST,
    GENDER_LIST,
    NOTE_TYPE_LIST,
    PERFUME_NOTE_TYPE_SINGLE,
    PERFUME_NOTE_TYPE_NORMAL,
    MIN_SCORE,
    MAX_SCORE,
    DEFAULT_REVIEW_THRESHOLD,
};
