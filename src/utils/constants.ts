import {
    EAU_DE_COLOGNE,
    EAU_DE_TOILETTE,
    EAU_DE_PERFUME,
    PERFUME,
    ETC,
} from '@utils/strings';

const GENDER_MAN: number = 1;
const GENDER_WOMAN: number = 2;
const GRADE_USER: number = 0;
const GRADE_MANAGER: number = 1;
const GRADE_SYSTEM_ADMIN: number = 9;

const ABUNDANCE_RATE_STR_DICT: { [key: string]: string } = new Proxy<{
    [key: string]: string;
}>(
    {
        '2': EAU_DE_COLOGNE,
        '3': EAU_DE_TOILETTE,
        '4': EAU_DE_PERFUME,
        '5': PERFUME,
    },
    {
        get: (target, name) => (name in target ? target[name.toString()] : ETC),
    }
);

const DEFAULT_PAGE_SIZE: number = 100;

const DEFAULT_RECOMMEND_REQUEST_SIZE: number = 7;
const DEFAULT_NEW_PERFUME_REQUEST_SIZE: number = 50;
const DEFAULT_SIMILAR_PERFUMES_REQUEST_SIZE: number = 20;
const DEFAULT_RECENT_ADDED_PERFUME_REQUEST_SIZE: number = 7;
const DEFAULT_BRAND_REQUEST_SIZE: number = 1000;
const DEFAULT_INGREDIENT_REQUEST_SIZE: number = 2000;

export {
    GENDER_MAN,
    GENDER_WOMAN,
    GRADE_USER,
    GRADE_MANAGER,
    GRADE_SYSTEM_ADMIN,
    ABUNDANCE_RATE_STR_DICT,
    DEFAULT_PAGE_SIZE,
    DEFAULT_RECOMMEND_REQUEST_SIZE,
    DEFAULT_NEW_PERFUME_REQUEST_SIZE,
    DEFAULT_RECENT_ADDED_PERFUME_REQUEST_SIZE,
    DEFAULT_SIMILAR_PERFUMES_REQUEST_SIZE,
    DEFAULT_BRAND_REQUEST_SIZE,
    DEFAULT_INGREDIENT_REQUEST_SIZE,
};
