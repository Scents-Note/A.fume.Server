import { NotMatchedError, FailedToCreateError } from '../utils/errors/errors';
import UserDao from '../dao/UserDao';
import PagingDTO from '../data/dto/PagingDTO';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';
import PerfumeThumbDTO from '../data/dto/PerfumeThumbDTO';
import PerfumeThumbKeywordDTO from '../data/dto/PerfumeThumbKeywordDTO';
import PerfumeSummaryDTO from '../data/dto/PerfumeSummaryDTO';
import PerfumeSearchDTO from '../data/dto/PerfumeSearchDTO';

import { updateRows, removeKeyJob, extractJob, flatJob } from '../utils/func';

let perfumeDao = require('../dao/PerfumeDao.js');
let reviewDao = require('../dao/ReviewDao.js');
let noteDao = require('../dao/NoteDao');
let likePerfumeDao = require('../dao/LikePerfumeDao.js');
let keywordDao = require('../dao/KeywordDao.js');
let defaultReviewDao = require('../dao/PerfumeDefaultReviewDao.js');
let s3FileDao = require('../dao/S3FileDao.js');
let userDao = new UserDao();

const {
    GENDER_WOMAN,
    PERFUME_NOTE_TYPE_SINGLE,
    PERFUME_NOTE_TYPE_NORMAL,
    DEFAULT_REVIEW_THRESHOLD,
} = require('../utils/constantUtil.js');

const { NoteDictDTO, PerfumeIntegralDTO } = require('../data/dto');

function isLikeJob(likePerfumeList) {
    const likeMap = likePerfumeList.reduce((prev, cur) => {
        prev[cur.perfumeIdx] = true;
        return prev;
    }, {});
    return (obj) => {
        const ret = Object.assign({}, obj);
        ret.isLiked = likeMap[obj.perfumeIdx] ? true : false;
        return ret;
    };
}

function addKeyword(joinKeywordList) {
    const keywordMap = joinKeywordList.reduce((prev, cur) => {
        if (!prev[cur.perfumeIdx]) prev[cur.perfumeIdx] = [];
        prev[cur.perfumeIdx].push(cur.Keyword.name);
        return prev;
    }, {});

    return (obj) => {
        const ret = Object.assign({}, obj);
        ret.keywordList = keywordMap[obj.perfumeIdx] || [];
        return ret;
    };
}

const commonJob = [
    extractJob('Brand', ['name', 'brandName']),
    removeKeyJob(
        'perfume_idx',
        'englishName',
        'brandIdx',
        'createdAt',
        'updatedAt'
    ),
];

async function generateNote(perfumeIdx) {
    const noteList = await noteDao.readByPerfumeIdx(perfumeIdx);
    const noteDictDTO = NoteDictDTO.createByNoteList(noteList);
    const noteType =
        noteDictDTO.single.length > 0
            ? PERFUME_NOTE_TYPE_SINGLE
            : PERFUME_NOTE_TYPE_NORMAL;
    return { noteType, noteDictDTO };
}

function getDefaultReviewRate(x) {
    return 1 - Math.max(0, x / DEFAULT_REVIEW_THRESHOLD);
}

async function generateSummary(perfumeIdx, defaultReviewDTO) {
    const reviewList = await reviewDao.readAllOfPerfume(perfumeIdx);
    const userSummary = PerfumeSummaryDTO.createByReviewList(reviewList);
    if (!defaultReviewDTO) {
        return userSummary;
    }
    const defaultSummary = PerfumeSummaryDTO.createByDefault(defaultReviewDTO);
    const defaultReviewRate = getDefaultReviewRate(reviewList.length);
    return PerfumeSummaryDTO.merge(
        defaultSummary,
        userSummary,
        defaultReviewRate
    );
}

function isLike({ userIdx, perfumeIdx }) {
    return likePerfumeDao
        .read(userIdx, perfumeIdx)
        .then((it) => true)
        .catch((err) => {
            if (err instanceof NotMatchedError) {
                return false;
            }
            throw err;
        });
}

/**
 * 향수 세부 정보 조회
 *
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @returns {Promise<Perfume>}
 **/
exports.getPerfumeById = async (perfumeIdx, userIdx) => {
    let _perfume = await perfumeDao.readByPerfumeIdx(perfumeIdx);
    const perfume = [...commonJob, flatJob('PerfumeDetail')].reduce(
        (prev, cur) => cur(prev),
        _perfume
    );

    const defaultReviewDTO = await defaultReviewDao
        .readByPerfumeIdx(perfumeIdx)
        .catch((err) => {
            return null;
        });
    perfume.isLiked = await isLike({ userIdx, perfumeIdx });
    const keywordList = [
        ...new Set(
            (await keywordDao.readAllOfPerfume(perfumeIdx))
                .concat(defaultReviewDTO ? defaultReviewDTO.keywordList : [])
                .map((it) => it.name)
        ),
    ];
    const imageUrls = [
        perfume.imageUrl,
        ...(await s3FileDao.getS3ImageList(perfumeIdx)),
    ];

    const { noteType, noteDictDTO } = await generateNote(perfumeIdx);
    const perfumeSummaryDTO = await generateSummary(
        perfumeIdx,
        defaultReviewDTO
    );

    const reviewIdx = await reviewDao
        .findOne({ userIdx, perfumeIdx })
        .then((it) => it.id || 0)
        .catch((_) => 0);
    return PerfumeIntegralDTO.create({
        perfumeDTO: perfume,
        keywordList,
        perfumeSummaryDTO,
        noteDictDTO,
        noteType,
        imageUrls,
        reviewIdx,
    });
};

/**
 * 향수 검색
 *
 * @param {PerfumeSearchRequestDTO} perfumeSearchRequestDTO
 * @param {PagingRequestDTO} pagingRequestDTO
 * @returns {Promise<Perfume[]>}
 **/
exports.searchPerfume = ({ perfumeSearchRequestDTO, pagingRequestDTO }) => {
    const { pagingIndex, pagingSize, order } =
        PagingDTO.create(pagingRequestDTO);
    const {
        brandIdxList,
        ingredientIdxList,
        keywordIdxList,
        searchText,
        userIdx,
    } = PerfumeSearchDTO.create(perfumeSearchRequestDTO);
    return perfumeDao
        .search(
            brandIdxList,
            ingredientIdxList,
            keywordIdxList,
            searchText,
            pagingIndex,
            pagingSize,
            order
        )
        .then(async (result) => {
            const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
            const likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
            updateRows(result, ...commonJob, isLikeJob(likePerfumeList));
            /* TODO */
            // return new ListAndCountDTO<PerfumeThumbDTO>(
            return new ListAndCountDTO(
                result.count,
                result.rows.map(PerfumeThumbDTO.createByJson)
            );
        });
};

/**
 * Survey 향수 조회
 *
 * @param {number} userIdx
 * @returns {Promise<Brand[]>}
 **/
exports.getSurveyPerfume = (userIdx) => {
    return userDao
        .readByIdx(userIdx)
        .then((it) => {
            return perfumeDao.readPerfumeSurvey(it.gender);
        })
        .then(async (result) => {
            const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
            const likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
            updateRows(result, ...commonJob, isLikeJob(likePerfumeList));
            /* TODO */
            // return new ListAndCountDTO<PerfumeThumbDTO>(
            return new ListAndCountDTO(
                result.count,
                result.rows.map(PerfumeThumbDTO.createByJson)
            );
        });
};

/**
 * 향수 좋아요
 *
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @returns {Promise}
 **/
exports.likePerfume = (userIdx, perfumeIdx) => {
    return new Promise((resolve, reject) => {
        likePerfumeDao
            .read(userIdx, perfumeIdx)
            .then((res) => {
                return likePerfumeDao
                    .delete(userIdx, perfumeIdx)
                    .then((it) => true);
            })
            .catch((err) => {
                if (err instanceof NotMatchedError) {
                    return likePerfumeDao
                        .create(userIdx, perfumeIdx)
                        .then((it) => false);
                }
                reject(new FailedToCreateError());
            })
            .then((exist) => {
                resolve(!exist);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

/**
 * 유저의 최근 검색한 향수 조회
 *
 * @param {number} userIdx
 * @param {PagingRequestDTO} pagingRequestDTO
 * @returns {Promise<Perfume[]>}
 **/
exports.recentSearch = ({ userIdx, pagingRequestDTO }) => {
    const { pagingIndex, pagingSize } = PagingDTO.create(pagingRequestDTO);
    return perfumeDao
        .recentSearchPerfumeList(userIdx, pagingIndex, pagingSize)
        .then(async (result) => {
            const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
            const likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
            updateRows(result, ...commonJob, isLikeJob(likePerfumeList));
            /* TODO */
            // return new ListAndCountDTO<PerfumeThumbDTO>(
            return new ListAndCountDTO(
                result.count,
                result.rows.map(PerfumeThumbDTO.createByJson)
            );
        });
};

/**
 * 유저 연령대 및 성별에 따른 향수 추천
 *
 * @param {number} userIdx
 * @param {number} pagingRequestDTO
 * @returns {Promise<Perfume[]>}
 **/
exports.recommendByUser = async ({ userIdx, pagingRequestDTO }) => {
    const { pagingIndex, pagingSize } = PagingDTO.create(pagingRequestDTO);
    const { ageGroup, gender } = await getAgeGroupAndGender(userIdx);

    const recommendedListPromise = recommendByGenderAgeAndGender(
        gender,
        ageGroup,
        pagingIndex,
        pagingSize
    );

    return recommendedListPromise.then(async (result) => {
        const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
        let likePerfumeList = [];
        if (userIdx > -1) {
            likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
        }

        const joinKeywordList = await keywordDao.readAllOfPerfumeIdxList(
            perfumeIdxList
        );

        updateRows(
            result,
            ...commonJob,
            isLikeJob(likePerfumeList),
            addKeyword(joinKeywordList)
        );
        /* TODO */
        // return new ListAndCountDTO<PerfumeThumbKeywordDTO>(
        return new ListAndCountDTO(
            result.count,
            result.rows.map(PerfumeThumbKeywordDTO.createByJson)
        );
    });
};

/**
 * 유저 연령대 및 성별에 따른 향수 추천
 *
 * @param {number} gender
 * @param {number} ageGroup
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise<Perfume[]>}
 **/
function recommendByGenderAgeAndGender(gender, ageGroup, pagingRequestDTO) {
    const { pagingIndex, pagingSize } = PagingDTO.create(pagingRequestDTO);
    return perfumeDao.recommendPerfumeByAgeAndGender(
        gender,
        ageGroup,
        pagingIndex,
        pagingSize
    );
}

exports.recommendByGenderAgeAndGender = (gender, ageGroup, pagingRequestDTO) =>
    recommendByGenderAgeAndGender(gender, ageGroup, pagingRequestDTO);

/**
 * 새로 추가된 향수 조회
 *
 * @param {number} userIdx
 * @param {number} pagingRequestDTO
 * @returns {Promise<Perfume[]>}
 **/
exports.getNewPerfume = ({ userIdx, pagingRequestDTO }) => {
    const { pagingIndex, pagingSize } = PagingDTO.create(pagingRequestDTO);
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    return perfumeDao
        .readNewPerfume(fromDate, pagingIndex, pagingSize)
        .then(async (result) => {
            const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
            const likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
            updateRows(result, ...commonJob, isLikeJob(likePerfumeList));

            /* TODO */
            // return new ListAndCountDTO<PerfumeThumbDTO>(
            return new ListAndCountDTO(
                result.count,
                result.rows.map(PerfumeThumbDTO.createByJson)
            );
        });
};

/**
 * 유저가 좋아요한 향수 조회
 *
 * @param {number} userIdx
 * @param {number} pagingRequestDTO
 * @returns {Promise<Perfume[]>}
 **/
exports.getLikedPerfume = ({ userIdx, pagingRequestDTO }) => {
    const { pagingIndex, pagingSize } = PagingDTO.create(pagingRequestDTO);
    return perfumeDao
        .readLikedPerfume(userIdx, pagingIndex, pagingSize)
        .then(async (result) => {
            const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
            const likePerfumeList = await likePerfumeDao.readLikeInfo(
                userIdx,
                perfumeIdxList
            );
            updateRows(result, ...commonJob, isLikeJob(likePerfumeList));
            /* TODO */
            // return new ListAndCountDTO<PerfumeThumbDTO>(
            return new ListAndCountDTO(
                result.count,
                result.rows.map(PerfumeThumbDTO.createByJson)
            );
        });
};

async function getAgeGroupAndGender(userIdx) {
    if (userIdx == -1) {
        return {
            gender: GENDER_WOMAN,
            ageGroup: 20,
        };
    }
    const user = await userDao.readByIdx(userIdx);
    const today = new Date();
    const age = today.getFullYear() - user.birth + 1;
    const gender = user.gender;
    const ageGroup = parseInt(age / 10) * 10;
    return { gender, ageGroup };
}

exports.setPerfumeDao = (dao) => {
    perfumeDao = dao;
};

exports.setReviewDao = (dao) => {
    reviewDao = dao;
};

exports.setNoteDao = (dao) => {
    noteDao = dao;
};

exports.setLikePerfumeDao = (dao) => {
    likePerfumeDao = dao;
};

exports.setKeywordDao = (dao) => {
    keywordDao = dao;
};

exports.setUserDao = (dao) => {
    userDao = dao;
};

exports.setS3FileDao = (dao) => {
    s3FileDao = dao;
};

exports.setDefaultReviewDao = (dao) => {
    defaultReviewDao = dao;
};

exports.getDefaultReviewRate = (x) => getDefaultReviewRate(x);
