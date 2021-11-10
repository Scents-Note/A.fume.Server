import { UnAuthorizedError } from '../utils/errors/errors';

const reviewDao = require('../dao/ReviewDao.js');
const likeReviewDao = require('../dao/LikeReviewDao');
const keywordDao = require('../dao/KeywordDao');
const {
    InputIntToDBIntOfReview,
    DBIntToOutputIntOfReview,
    getApproxAge,
} = require('../utils/converter');

/**
 * 시향노트 작성
 *
 * @param {Object} Review
 * @returns {Promise}
 **/
exports.postReview = async ({
    perfumeIdx,
    userIdx,
    score,
    longevity,
    sillage,
    seasonal,
    gender,
    access,
    content,
    keywordList,
}) => {
    // 데이터 변환
    const translationResult = await InputIntToDBIntOfReview({
        longevity,
        sillage,
        seasonalList: seasonal,
        gender,
        keywordList,
    });

    const createReview = await reviewDao.create({
        perfumeIdx,
        userIdx,
        score,
        longevity: translationResult.longevity,
        sillage: translationResult.sillage,
        seasonal: translationResult.sumOfBitSeasonal,
        gender: translationResult.gender,
        access: access ? 1 : 0,
        content,
    });

    const reviewIdx = createReview.dataValues.id;
    const KeywordIdxList = translationResult.keywordList;
    const createReviewKeyword = await Promise.all(
        KeywordIdxList.map((it) => {
            keywordDao.create({ reviewIdx, keywordIdx: it, perfumeIdx });
        })
    );
    return reviewIdx;
};

/**
 * 시향노트 삭제
 * 시향노트 삭제하기
 *
 * @param {Object} Review
 * @returns {Promise}
 **/
exports.deleteReview = async ({ reviewIdx, userIdx }) => {
    const readReviewResult = await reviewDao.read(reviewIdx);
    if (readReviewResult.userIdx != userIdx) {
        throw new UnAuthorizedError();
    }
    const perfumeIdx = readReviewResult.perfumeIdx;
    const deleteReviewKeyword = await keywordDao.deleteReviewKeyword({
        reviewIdx,
        perfumeIdx,
    });
    const deleteOnlyReview = await reviewDao.delete(reviewIdx);

    return deleteOnlyReview;
};

/**
 * 시향노트 수정
 *
 * @param {Object} Review
 * @returns {Promise}
 **/
exports.updateReview = async ({
    score,
    longevity,
    sillage,
    seasonal,
    gender,
    access,
    content,
    keywordList,
    reviewIdx,
    userIdx,
}) => {
    // 데이터 변환
    const translationResult = await InputIntToDBIntOfReview({
        longevity,
        sillage,
        seasonalList: seasonal,
        gender,
        keywordList,
    });

    // 권환 확인
    const readReviewResult = await reviewDao.read(reviewIdx);
    if (readReviewResult.userIdx != userIdx) {
        throw new UnAuthorizedError();
    }

    const updateReviewResult = await reviewDao.update({
        score,
        longevity: translationResult.longevity,
        sillage: translationResult.sillage,
        seasonal: translationResult.sumOfBitSeasonal,
        gender: translationResult.gender,
        access: access ? 1 : 0,
        content,
        reviewIdx,
    });
    const deleteReviewKeyword = await keywordDao.deleteReviewKeyword({
        reviewIdx,
        perfumeIdx: readReviewResult.perfumeIdx,
    });

    const KeywordIdxList = translationResult.keywordList;
    const createReviewKeyword = await Promise.all(
        KeywordIdxList.map((it) => {
            keywordDao.create({
                reviewIdx,
                keywordIdx: it,
                perfumeIdx: readReviewResult.perfumeIdx,
            });
        })
    );

    return reviewIdx;
};

/**
 * 시향노트 조회
 *
 * @param {Object} whereObj
 * @returns {Promise<Review>}
 **/
exports.getReviewByIdx = async (reviewIdx) => {
    const result = await reviewDao.read(reviewIdx);
    const translationResult = await DBIntToOutputIntOfReview({
        longevity: result.longevity,
        sillage: result.sillage,
        sumOfBitSeasonal: result.seasonal,
        gender: result.gender,
    });
    return {
        reviewIdx: result.id,
        score: result.score,
        longevity: translationResult.longevity,
        sillage: translationResult.sillage,
        seasonal: translationResult.seasonalList
            ? translationResult.seasonalList
            : [],
        gender: translationResult.gender,
        access: result.access == 1 ? true : false,
        content: result.content,
        Perfume: {
            perfumeIdx: result.Perfume.perfumeIdx,
            perfumeName: result.Perfume.name,
            imageUrl: result.Perfume.imageUrl,
        },
        KeywordList: result.keywordList.map((it) => {
            return {
                keywordIdx: it.keywordIdx,
                name: it.keyword,
            };
        }),
        Brand: {
            brandIdx: result.Perfume.Brand.brandIdx,
            brandName: result.Perfume.Brand.name,
        },
    };
};

/**
 * 내가 쓴 시향기 전체 조회
 *  = 마이퍼퓸 조회
 *
 * @param {number} userIdx
 * @returns {Promise<Review[]>} reviewList
 **/
exports.getReviewOfUser = async (userIdx) => {
    return (await reviewDao.readAllOfUser(userIdx)).map((it) => {
        return {
            reviewIdx: it.id,
            score: it.score,
            perfumeIdx: it.perfumeIdx,
            perfumeName: it.Perfume.name,
            imageUrl: it.Perfume.imageUrl,
            brandIdx: it.Perfume.brandIdx,
            brandName: it.Perfume.Brand.englishName,
        };
    });
};

/**
 * 전체 시향노트 반환(인기순)
 * 특정 향수에 달린 전체 시향노트 인기순으로 가져오기
 *
 * @param {number} perfumeIdx
 * @returns {Promise<Review[]>} reviewList
 **/
exports.getReviewOfPerfumeByLike = async ({ perfumeIdx, userIdx }) => {
    const reviewList = await reviewDao.readAllOfPerfume(perfumeIdx);
    const result = await reviewList.reduce(async (prevPromise, it) => {
        let prevResult = await prevPromise.then();
        const approxAge = getApproxAge(it.User.birth);
        const readLikeResult = await likeReviewDao.read(userIdx, it.reviewIdx);
        const currentResult = {
            reviewIdx: it.reviewIdx,
            score: it.score,
            access: it.access == 1 ? true : false,
            content: it.content,
            likeCount: it.LikeReview.likeCount,
            isLiked: readLikeResult ? true : false,
            userGender: it.User.gender,
            age: approxAge,
            nickname: it.User.nickname,
            createTime: it.createdAt,
        };
        prevResult.push(currentResult);
        return Promise.resolve(prevResult);
    }, Promise.resolve([]));
    return result;
};

/**
 * 시향노트 좋아요 생성/취소
 *
 * @param {number} reviewIdx
 * @param {number} userIdx
 * @returns {boolean} isLiked
 * reviewIdx Long 시향노트 Idx
 * returns Boolean
 **/
exports.likeReview = async (reviewIdx, userIdx) => {
    const resultOfReadLike = await likeReviewDao.read(userIdx, reviewIdx);
    let isLiked = resultOfReadLike ? true : false;
    if (!isLiked) {
        await likeReviewDao.create(userIdx, reviewIdx);
    }
    if (isLiked) {
        await likeReviewDao.delete(userIdx, reviewIdx);
    }
    return !isLiked;
};

// /**
//  * 전체 시향노트 반환(별점순)
//  * 특정 향수에 달린 전체 시향노트 별점순으로 가져오기
//  *
//  * perfumeIdx Long 향수 Idx
//  * returns List
//  **/
//  exports.getReviewOfPerfumeByScore = (perfumeIdx) => {
//     return reviewDao.readAllOrderByScore(perfumeIdx);
// };

// /**
//  * 전체 시향노트 반환(최신순)
//  * 특정 향수에 달린 전체 시향노트 최신순으로 가져오기
//  *
//  * perfumeIdx Long 향수 Idx
//  * returns List
//  **/
// exports.getReviewOfPerfumeByRecent = (perfumeIdx) => {
//     return reviewDao.readAllOrderByRecent(perfumeIdx);
// };
