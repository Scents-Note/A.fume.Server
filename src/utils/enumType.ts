const constantUtil = require('./constantUtil');

const GENDER_MAN: number = constantUtil.GENDER_MAN;
const GENDER_WOMAN: number = constantUtil.GENDER_WOMAN;
const GRADE_USER: number = constantUtil.GRADE_USER;
const GRADE_MANAGER: number = constantUtil.GRADE_MANAGER;
const GRADE_SYSTEM_ADMIN: number = constantUtil.GRADE_SYSTEM_ADMIN;

const GenderMap: { [index: string]: number } = {
    MAN: GENDER_MAN,
    WOMAN: GENDER_WOMAN,
} as const;

const GenderInvMap: { [index: number]: string } = {
    [GENDER_MAN]: 'MAN',
    [GENDER_WOMAN]: 'WOMAN',
} as const;

export type GenderKey = keyof typeof GenderMap;
export type Gender = typeof GenderMap[keyof typeof GenderMap];

const GradeMap: { [index: string]: number } = {
    USER: GRADE_USER,
    MANAGER: GRADE_MANAGER,
    SYSTEM_ADMIN: GRADE_SYSTEM_ADMIN,
} as const;

export type GradeKey = keyof typeof GradeMap;
export type Grade = typeof GradeMap[keyof typeof GradeMap];

export { GenderMap, GenderInvMap, GradeMap };
