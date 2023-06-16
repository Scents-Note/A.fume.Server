var Review = require('../service/ReviewService');
import StatusCode from '../utils/statusCode';

import { NextFunction, Request, Response } from 'express';

export const postReview = async (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const perfumeIdx = req.params['perfumeIdx'];
    const userIdx = req.middlewareToken.loginUserIdx;
    const {
        score,
        longevity,
        sillage,
        seasonal,
        gender,
        access,
        content,
        keywordList,
    } = req.body;
    try {
        const response = await Review.postReview({
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
        });
        res.status(StatusCode.OK).json({
            message: '시향노트 추가 성공',
            data: {
                reviewIdx: response,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const getReviewByIdx = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    var reviewIdx = req.params['reviewIdx'];
    try {
        const response = await Review.getReviewByIdx(reviewIdx);
        res.status(StatusCode.OK).json({
            message: '시향노트 조회 성공',
            data: response,
        });
    } catch (err) {
        next(err);
    }
};

export const getPerfumeReview = async (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    var perfumeIdx = req.params['perfumeIdx'];
    const userIdx = req.middlewareToken.loginUserIdx;
    try {
        const response = await Review.getReviewOfPerfumeByLike({
            perfumeIdx,
            userIdx,
        });
        res.status(StatusCode.OK).json({
            message: '특정 향수의 시향노트 목록 인기순 조회 성공',
            data: response,
        });
    } catch (err) {
        next(err);
    }
};

export const getReviewOfUser = async (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const userIdx = req.middlewareToken.loginUserIdx;
    try {
        const response = await Review.getReviewOfUser(userIdx);
        res.status(StatusCode.OK).json({
            message: '마이퍼퓸 조회 성공',
            data: response,
        });
    } catch (err) {
        next(err);
    }
};

export const putReview = async (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    var reviewIdx = req.params['reviewIdx'];
    const userIdx = req.middlewareToken.loginUserIdx;
    var {
        score,
        longevity,
        sillage,
        seasonal,
        gender,
        access,
        content,
        keywordList,
    } = req.body;
    try {
        await Review.updateReview({
            reviewIdx,
            userIdx,
            score,
            longevity,
            sillage,
            seasonal,
            gender,
            access,
            content,
            keywordList,
        });
        res.status(StatusCode.OK).json({
            message: '시향노트 수정 성공',
        });
    } catch (err) {
        next(err);
    }
};

export const deleteReview = async (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const reviewIdx = req.params['reviewIdx'];
    const userIdx = req.middlewareToken.loginUserIdx;
    try {
        await Review.deleteReview({ reviewIdx, userIdx });
        res.status(StatusCode.OK).json({
            message: '시향노트 삭제 성공',
        });
    } catch (err) {
        next(err);
    }
};

export const likeReview = async (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const reviewIdx = req.params['reviewIdx'];
    const userIdx = req.middlewareToken.loginUserIdx;
    try {
        const result = await Review.likeReview(reviewIdx, userIdx);
        res.status(StatusCode.OK).json({
            message: '시향노트 좋아요 상태 변경 성공',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const reportReview = async (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const reviewIdx = req.params['reviewIdx'];
    const userIdx = req.middlewareToken.loginUserIdx;
    var { reason } = req.body;
    try {
        await Review.reportReview({
            userIdx,
            reviewIdx,
            reason,
        });
        res.status(StatusCode.OK).json({
            message: '시향노트 신고 성공',
        });
    } catch (err) {
        next(err);
    }
};
