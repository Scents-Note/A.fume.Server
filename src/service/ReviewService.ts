import { NotMatchedError, UnAuthorizedError } from '../utils/errors/errors';

import LikeReviewDao from '@dao/LikeReviewDao';
import ReportReviewDao from '@dao/ReportReviewDao';

const likeReviewDao = new LikeReviewDao();
const reportReviewDao = new ReportReviewDao();

import {
    InputIntToDBIntOfReview,
    DBIntToOutputIntOfReview,
    getApproxAge,
} from '../utils/converter';
import { discordManager } from '../utils/discordHook';

import UserDao from '@dao/UserDao';
import LikePerfumeDao from '@dao/LikePerfumeDao';
import ReviewDao from '@dao/ReviewDao';
import KeywordDao from '../dao/KeywordDao';
import { PRIVATE } from '@src/utils/strings';

const userDao = new UserDao();
const likePerfumeDao = new LikePerfumeDao();
const reviewDao = new ReviewDao();
const keywordDao = new KeywordDao();

const discordHook = discordManager.getReportReviewHook();

interface ReviewVO {
    userIdx: number;
    score: number;
    longevity: number;
    sillage: number;
    seasonal: string[];
    gender: number;
    access: number;
    content: string;
    keywordList: string[];
}

export class ReviewService {
    /**
     * 시향노트 작성
     *
     * @param {Object} Review
     * @returns {Promise}
     **/
    postReview = async ({
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
    }: ReviewVO & { perfumeIdx: number }) => {
        try {
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
            await Promise.all(
                KeywordIdxList.map((it) => {
                    keywordDao.create({
                        reviewIdx,
                        keywordIdx: it,
                        perfumeIdx,
                    });
                })
            );
            try {
                await likePerfumeDao.delete(userIdx, perfumeIdx);
            } catch (err) {
                if (err instanceof NotMatchedError) {
                } else throw err;
            }
            return reviewIdx;
        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    /**
     * 시향노트 삭제
     * 시향노트 삭제하기
     *
     * @param {Object} Review
     * @returns {Promise}
     **/
    deleteReview = async ({
        reviewIdx,
        userIdx,
    }: {
        reviewIdx: number;
        userIdx: number;
    }) => {
        const readReviewResult = await reviewDao.read(reviewIdx);
        if (readReviewResult.userIdx != userIdx) {
            throw new UnAuthorizedError();
        }
        const perfumeIdx = readReviewResult.perfumeIdx;
        await keywordDao.deleteReviewKeyword({
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
    updateReview = async ({
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
    }: ReviewVO & { reviewIdx: number }) => {
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

        await reviewDao.update({
            score,
            longevity: translationResult.longevity,
            sillage: translationResult.sillage,
            seasonal: translationResult.sumOfBitSeasonal,
            gender: translationResult.gender,
            access: access ? 1 : 0,
            content,
            reviewIdx,
        });
        await keywordDao.deleteReviewKeyword({
            reviewIdx,
            perfumeIdx: readReviewResult.perfumeIdx,
        });

        const KeywordIdxList = translationResult.keywordList;
        await Promise.all(
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
    getReviewByIdx = async (reviewIdx: number) => {
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
    getReviewOfUser = async (userIdx: number) => {
        const result = await reviewDao.readAllOfUser(userIdx);
        return result.map((it) => {
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
    getReviewOfPerfumeByLike = async ({
        perfumeIdx,
        userIdx,
    }: {
        perfumeIdx: number;
        userIdx: number;
    }) => {
        try {
            const reviewList = await reviewDao.readAllOfPerfume(perfumeIdx);

            // 유저가 신고한 시향노트 인덱스 목록 조회
            const allReportedReviewByUser =
                await reportReviewDao.readAllReportedReviewByUser(userIdx);
            const reportedReviewIdxList = allReportedReviewByUser.map((it) => {
                return it.reviewIdx;
            });

            const result = await reviewList.reduce(async (prevPromise, it) => {
                let prevResult = await prevPromise.then();
                const approxAge = it.User.birth
                    ? getApproxAge(it.User.birth)
                    : PRIVATE;
                const readLikeResult = await likeReviewDao.read(
                    userIdx,
                    it.reviewIdx
                );
                const currentResult = {
                    reviewIdx: it.reviewIdx,
                    score: it.score,
                    access: it.access == 1 ? true : false,
                    content: it.content,
                    likeCount: it.LikeReview.likeCount,
                    isLiked: readLikeResult ? true : false,
                    userGender: it.User.gender || PRIVATE,
                    age: approxAge,
                    nickname: it.User.nickname,
                    createTime: it.createdAt,
                    isReported: reportedReviewIdxList.includes(it.reviewIdx),
                };
                prevResult.push(currentResult);
                return Promise.resolve(prevResult);
            }, Promise.resolve([]));
            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    /**
     * 시향노트 신고
     *
     * @param {String} reason
     * @param {Number} userIdx
     * @returns {Promise}
     **/
    reportReview = async ({
        userIdx,
        reviewIdx,
        reason,
    }: {
        userIdx: number;
        reviewIdx: number;
        reason: string;
    }) => {
        try {
            const userInfo = await userDao.readByIdx(userIdx);
            const userNickname = userInfo.nickname;
            const reviewData = await reviewDao.read(reviewIdx);
            const perfumeName = reviewData.Perfume.name;
            const reviewContent = reviewData.content;

            // 신고 정보 저장
            await reportReviewDao.create({
                reporterIdx: userIdx,
                reviewIdx,
                reason,
            });

            // 디스코드로 신고 알림 전송
            await discordHook?.send(
                `시향노트 신고가 들어왔습니다.\n\n신고 사유 : ${reason} \n향수명 : ${perfumeName} \n시향노트 내용 : ${reviewContent} \n신고자 : ${userNickname} \n시향노트 Idx : ${reviewIdx} `
            );

            return true;
        } catch (err) {
            console.log(err);
            throw err;
        }
    };
}

export default ReviewService;
