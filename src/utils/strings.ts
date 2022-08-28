const _success: string = '성공';
const _get: string = '조회';
const _post: string = '등록';
const _update: string = '수정';
const _delete: string = '삭제';
const _detail: string = '상세';
const _recommend: string = '추천';
const _cancel: string = '취소';
const _all: string = '전체';
const _search: string = '검색';

const NONE: string = 'None';
const EAU_DE_COLOGNE: string = '오 드 코롱';
const EAU_DE_TOILETTE: string = '오 드 뚜왈렛';
const EAU_DE_PERFUME: string = '오 드 퍼퓸';
const PERFUME: string = '퍼퓸';
const ETC: string = '기타';

const SPRING: string = 'spring';
const SUMMER: string = 'summer';
const FALL: string = 'fall';
const WINTER: string = 'winter';

const LIGHT: string = 'light';
const MEDIUM: string = 'medium';
const HEAVY: string = 'heavy';

const VERY_WEAK: string = 'veryWeak';
const WEAK: string = 'weak';
const NORMAL: string = 'normal';
const STRONG: string = 'strong';
const VERY_STRONG: string = 'veryStrong';

const MALE: string = 'male';
const NEUTRAL: string = 'neutral';
const FEMALE: string = 'female';

const TOP: string = 'top';
const MIDDLE: string = 'middle';
const BASE: string = 'base';
const SINGLE: string = 'single';

const MSG_GET_BRAND_FILTER_SUCCESS: string = `브랜드 필터 ${_get} ${_success}`;
const MSG_GET_BRAND_ALL_SUCCESS: string = `브랜드 ${_all} ${_get} ${_success}`;
const MSG_GET_SEARCH_INGREDIENT_SUCCESS: string = `재료 ${_search} ${_get} ${_success}`;

const MSG_GET_PERFUME_DETAIL_SUCCESS: string = `향수 ${_detail} ${_get} ${_success}`;
const MSG_GET_SEARCH_PERFUME_SUCCESS: string = `향수 ${_search} ${_get} ${_success}`;

const LIKE_PERFUME: string = '향수 좋아요';
const LIKE_PERFUME_CANCEL: string = `${LIKE_PERFUME} ${_cancel}`;

const MSG_GET_RECENT_SEARCH_PERFUME_SUCCESS: string = `최근 검색한 향수 ${_get} ${_success}`;

const MSG_GET_RECOMMEND_PERFUME_BY_USER: string = `향수 개인 맞춤 ${_recommend}`;
const MSG_GET_RECOMMEND_PERFUME_BY_AGE_AND_GENDER: string = `향수 일반 ${_recommend} (성별, 나이 반영)`;
const MSG_GET_PERFUME_SIMILARS_BY_PERFUME: string =
    '현재 향수와 비슷한 향수 리스트 입니다.';

const MSG_GET_PERFUME_FOR_SURVEY_SUCCESS: string = `서베이 향수 ${_get} ${_success}`;

const MSG_GET_ADDED_PERFUME_RECENT_SUCCESS: string = `새로 ${_post}된 향수 ${_get} ${_success}`;

const MSG_GET_LIKED_PERFUME_LIST_SUCCESS: string = `유저가 좋아요한 향수 ${_get} ${_success}`;

const MSG_ABNORMAL_ACCESS: string = '비정상적인 접근입니다.';

const MSG_GET_SERIES_ALL_SUCCESS: string = `series ${_all} ${_get} ${_success}`;

const MSG_GET_INGREDIENT_BY_SERIES_SUCCESS: string = `Series에 해당하는 Ingredient ${_get} ${_success}`;

const MSG_SEARCH_SERIES_LIST_SUCCESS: string = `계열 ${_search} ${_get} ${_success}`;

const MSG_REGISTER_SUCCESS: string = `회원가입 ${_success}`;
const MSG_DELETE_USER_SUCCESS: string = `유저 ${_delete} ${_success}`;
const MSG_LOGIN_SUCCESS: string = `로그인 ${_success}`;
const MSG_MODIFY_USER_SUCCESS: string = `유저 ${_update} ${_success}`;
const MSG_CHANGE_PASSWORD_SUCCESS: string = `비밀번호 변경 ${_success}`;
const MSG_GET_AUTHORIZE_INFO: string = `권한 ${_get}`;

const MSG_DUPLICATE_CHECK_EMAIL: string = 'Email 중복 체크';
const MSG_DUPLICATE_CHECK_EMAIL_AVAILABLE: string = `${MSG_DUPLICATE_CHECK_EMAIL}: 사용 가능`;
const MSG_DUPLICATE_CHECK_EMAIL_UNAVAILABLE: string = `${MSG_DUPLICATE_CHECK_EMAIL}: 사용 불가능`;

const MSG_DUPLICATE_CHECK_NAME: string = '이름 중복 체크';
const MSG_DUPLICATE_CHECK_NAME_AVAILABLE: string = `${MSG_DUPLICATE_CHECK_NAME}: 사용 가능`;
const MSG_DUPLICATE_CHECK_NAME_UNAVAILABLE: string = `${MSG_DUPLICATE_CHECK_NAME}: 사용 불가능`;

const MSG_POST_SURVEY_SUCCESS: string = `Survey 등록 ${_success}`;

const MSG_WRONG_FOREIGN_KEY: string = '잘못된 외래키입니다.';
const INTERNAL_DB_ERROR: string = '디비 내부 오류';
const MSG_EXIST_DUPLICATE_ENTRY: string = '중복되는 값이 이미 존재합니다';
const MSG_NOT_MATCHED_DATA: string = '해당 조건에 일치하는 데이터가 없습니다.';
const MSG_OCCUR_ERROR_DURING_CREATING_DATA: string =
    '해당 데이터를 생성하는 중에 오류가 발생헀습니다.';
const MSG_ENTER_INVALID_INPUT: string = '유효하지않은 값을 입력했습니다.';
const MSG_INVALID_VALUE: string = '유효하지 않는 값입니다.';
const MSG_INVALID_TOKEN: string = '유효하지 않는 토큰입니다.';
const MSG_EXPIRED_TOKEN: string = '만료된 토큰입니다.';
const MSG_WRONG_PASSWORD: string = '비밀번호가 잘못되었습니다';
const MSG_CANT_USE_PASSWORD_BY_POLICY: string =
    '사용할 수 없는 패스워드입니다. 패스워드 정책을 확인해주세요.';
const MSG_GET_SUPPORTABLE_YES: string = '현재 apk Version은 이용 가능합니다.';
const MSG_GET_SUPPORTABLE_NO: string =
    '현재 apk Version은 업데이트가 필요합니다.';

const NO_AUTHORIZE: string = '권한이 없습니다.';

const CURRENT_VERSION: string = process.env.npm_package_version || '0.0.3';
/* TODO BASE PATH 는 MAJOR만 따르도록 수정할 것. 0.0.1 -> 1.0 -> 2.0 */
const BASE_PATH: string = '/A.fume/api/0.0.1';

export {
    NONE,
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
    VERY_WEAK,
    WEAK,
    NORMAL,
    STRONG,
    VERY_STRONG,
    MALE,
    NEUTRAL,
    FEMALE,
    TOP,
    MIDDLE,
    BASE,
    SINGLE,
    MSG_GET_BRAND_FILTER_SUCCESS,
    MSG_GET_BRAND_ALL_SUCCESS,
    MSG_GET_SEARCH_INGREDIENT_SUCCESS,
    MSG_GET_PERFUME_DETAIL_SUCCESS,
    MSG_GET_SEARCH_PERFUME_SUCCESS,
    LIKE_PERFUME,
    LIKE_PERFUME_CANCEL,
    MSG_GET_RECENT_SEARCH_PERFUME_SUCCESS,
    MSG_GET_RECOMMEND_PERFUME_BY_USER,
    MSG_GET_RECOMMEND_PERFUME_BY_AGE_AND_GENDER,
    MSG_GET_PERFUME_SIMILARS_BY_PERFUME,
    MSG_GET_PERFUME_FOR_SURVEY_SUCCESS,
    MSG_GET_ADDED_PERFUME_RECENT_SUCCESS,
    MSG_GET_LIKED_PERFUME_LIST_SUCCESS,
    MSG_ABNORMAL_ACCESS,
    MSG_GET_SERIES_ALL_SUCCESS,
    MSG_GET_INGREDIENT_BY_SERIES_SUCCESS,
    MSG_SEARCH_SERIES_LIST_SUCCESS,
    MSG_REGISTER_SUCCESS,
    MSG_DELETE_USER_SUCCESS,
    MSG_LOGIN_SUCCESS,
    MSG_MODIFY_USER_SUCCESS,
    MSG_CHANGE_PASSWORD_SUCCESS,
    MSG_GET_AUTHORIZE_INFO,
    MSG_DUPLICATE_CHECK_EMAIL_AVAILABLE,
    MSG_DUPLICATE_CHECK_EMAIL_UNAVAILABLE,
    MSG_DUPLICATE_CHECK_NAME_AVAILABLE,
    MSG_DUPLICATE_CHECK_NAME_UNAVAILABLE,
    MSG_POST_SURVEY_SUCCESS,
    MSG_WRONG_FOREIGN_KEY,
    INTERNAL_DB_ERROR,
    MSG_EXIST_DUPLICATE_ENTRY,
    MSG_NOT_MATCHED_DATA,
    MSG_OCCUR_ERROR_DURING_CREATING_DATA,
    MSG_ENTER_INVALID_INPUT,
    MSG_INVALID_VALUE,
    MSG_INVALID_TOKEN,
    MSG_EXPIRED_TOKEN,
    MSG_WRONG_PASSWORD,
    MSG_CANT_USE_PASSWORD_BY_POLICY,
    MSG_GET_SUPPORTABLE_YES,
    MSG_GET_SUPPORTABLE_NO,
    NO_AUTHORIZE,
    CURRENT_VERSION,
    BASE_PATH,
};
