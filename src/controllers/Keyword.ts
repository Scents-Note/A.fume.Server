'use strict';

const Keyword = require('../service/KeywordService');
import { DEFAULT_PAGE_SIZE } from '@src/utils/constants';
import StatusCode from '../utils/statusCode';
import { NextFunction, Request, Response } from 'express';

export const getKeywordAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const pagingIndex = parseInt(req.query.pagingIndex?.toString() ?? '1');
    const pagingSize = parseInt(
        req.query.pagingSize?.toString() ?? `${DEFAULT_PAGE_SIZE}`
    );
    try {
        const response = await Keyword.getKeywordAll(pagingIndex, pagingSize);
        res.status(StatusCode.OK).json({
            message: '키워드 목록 전체 조회 성공',
            data: response,
        });
    } catch (err) {
        next(err);
    }
};

export const getKeywordOfPerfume = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const perfumeIdx = req.params['perfumeIdx'];
    try {
        const response = await Keyword.getKeywordOfPerfume(perfumeIdx);
        res.status(StatusCode.OK).json({
            message: '향수별 키워드 전체 조회 성공',
            data: response,
        });
    } catch (err) {
        next(err);
    }
};
