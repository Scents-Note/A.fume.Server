import dotenv from 'dotenv';
import request from 'supertest';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import JwtController from '../../src/lib/JwtController';
import TokenPayloadDTO from '../../src/data/dto/TokenPayloadDTO';
import StatusCode from '../../src/utils/statusCode';

import app from '../../src/app';

const basePath: string = '/A.fume/api/0.0.1';

const Perfume = require('../../src/controllers/Perfume');
import PerfumeThumbMockHelper from '../mock_helper/PerfumeThumbMockHelper';
import PerfumeThumbKeywordMockHelper from '../mock_helper/PerfumeThumbKeywordMockHelper';
import PerfumeIntegralMockHelper from '../mock_helper/PerfumeIntegralMockHelper';
import ListAndCountDTO from '../../src/data/dto/ListAndCountDTO';
import { ResponseDTO, SimpleResponseDTO } from '../../src/data/response/common';
import {
    PerfumeResponse,
    PerfumeDetailResponse,
    PerfumeRecommendResponse,
} from '../../src/data/response/perfume';

import {
    MSG_GET_PERFUME_DETAIL_SUCCESS,
    MSG_GET_SEARCH_PERFUME_SUCCESS,
    LIKE_PERFUME,
    LIKE_PERFUME_CANCEL,
    MSG_GET_RECENT_SEARCH_PERFUME_SUCCESS,
    MSG_GET_RECOMMEND_PERFUME_BY_USER,
    MSG_GET_RECOMMEND_PERFUME_BY_AGE_AND_GENDER,
    MSG_GET_PERFUME_FOR_SURVEY_SUCCESS,
    MSG_GET_ADDED_PERFUME_RECENT_SUCCESS,
    MSG_GET_LIKED_PERFUME_LIST_SUCCESS,
    MSG_ABNORMAL_ACCESS,
} from '../../src/utils/strings';

const user1tokenPerfume: string = JwtController.create(
    new TokenPayloadDTO(1, 'nickname', 'MAN', 'email', 1995)
);

const mockPerfumeService: any = {};
const mockSearchHistoryService: any = {};
const mockPerfumeList: any[] = [
    PerfumeThumbMockHelper.createWithIdx(2775),
    PerfumeThumbMockHelper.createWithIdx(2774),
    PerfumeThumbMockHelper.createWithIdx(2773),
    PerfumeThumbMockHelper.createWithIdx(2772),
    PerfumeThumbMockHelper.createWithIdx(2471),
    PerfumeThumbMockHelper.createWithIdx(2470),
    PerfumeThumbMockHelper.createWithIdx(2469),
    PerfumeThumbMockHelper.createWithIdx(2468),
    PerfumeThumbMockHelper.createWithIdx(2467),
    PerfumeThumbMockHelper.createWithIdx(2466),
];
const mockPerfumeKeywordList: any[] = [
    PerfumeThumbKeywordMockHelper.createWithIdx(1, ['키워드 1', '키워드2']),
    PerfumeThumbKeywordMockHelper.createWithIdx(2, ['키워드']),
    PerfumeThumbKeywordMockHelper.createWithIdx(3, [
        '키워드 1',
        '키워드2',
        '키워드3',
    ]),
    PerfumeThumbKeywordMockHelper.createWithIdx(4, []),
    PerfumeThumbKeywordMockHelper.createWithIdx(6, ['키워드 1', '키워드2']),
    PerfumeThumbKeywordMockHelper.createWithIdx(8, ['키워드']),
];
Perfume.setPerfumeService(mockPerfumeService);
Perfume.setSearchHistoryService(mockSearchHistoryService);

describe('# Perfume Controller Test', () => {
    describe('# getPerfume Test', () => {
        it('success case', (done: Done) => {
            mockPerfumeService.getPerfumeById = async () => {
                return PerfumeIntegralMockHelper.createMock({});
            };
            mockSearchHistoryService.incrementCount = async () => {};

            request(app)
                .get(`${basePath}/perfume/1`)
                .expect((res: request.Response) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const result: ResponseDTO<PerfumeDetailResponse> = res.body;
                    expect(result.message).to.be.eq(
                        MSG_GET_PERFUME_DETAIL_SUCCESS
                    );
                    done();
                })
                .catch((err: Error) => done(err));
        });
        describe('# searchPerfume Test', () => {
            it('success case', (done: Done) => {
                mockPerfumeService.searchPerfume = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 204,
                    };
                };

                request(app)
                    .post(`${basePath}/perfume/search`)
                    .send({
                        searchText: 'Tom',
                        keywordList: [],
                        ingredientList: [],
                        brandList: [],
                    })
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.OK);
                        const result: ResponseDTO<
                            ListAndCountDTO<PerfumeResponse>
                        > = res.body;
                        expect(result.message).to.be.eq(
                            MSG_GET_SEARCH_PERFUME_SUCCESS
                        );
                        expect(result.data!!.count).to.be.gte(0);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# likePerfume Test', () => {
            it('success case', (done: Done) => {
                mockPerfumeService.likePerfume = async () => true;
                request(app)
                    .post(`${basePath}/perfume/1/like`)
                    .set('x-access-token', 'Bearer ' + user1tokenPerfume)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.OK);
                        const responseDTO: ResponseDTO<boolean> = res.body;
                        expect(responseDTO.message).to.be.eq(
                            responseDTO.data
                                ? LIKE_PERFUME
                                : LIKE_PERFUME_CANCEL
                        );
                        expect(responseDTO.data).to.be.not.undefined;
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# getLikedPerfume Test', () => {
            it('# success case', (done: Done) => {
                mockPerfumeService.getLikedPerfume = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 204,
                    };
                };

                request(app)
                    .get(`${basePath}/user/1/perfume/liked`)
                    .set('x-access-token', 'Bearer ' + user1tokenPerfume)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.OK);
                        const responseDTO: ResponseDTO<
                            ListAndCountDTO<PerfumeResponse>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            MSG_GET_LIKED_PERFUME_LIST_SUCCESS
                        );
                        expect(responseDTO.data.count).to.be.gte(0);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# Fail: 유저 id 불일치', (done: Done) => {
                request(app)
                    .get(`${basePath}/user/2/perfume/liked`)
                    .set('x-access-token', 'Bearer ' + user1tokenPerfume)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.FORBIDDEN);
                        const responseDTO: SimpleResponseDTO = res.body;
                        expect(responseDTO.message).to.be.eq(
                            MSG_ABNORMAL_ACCESS
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# getRecentPerfume Test', () => {
            it('success case', (done: Done) => {
                mockPerfumeService.recentSearch = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/recent`)
                    .set('x-access-token', 'Bearer ' + user1tokenPerfume)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.OK);
                        const responseDTO: ResponseDTO<
                            ListAndCountDTO<PerfumeResponse>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            MSG_GET_RECENT_SEARCH_PERFUME_SUCCESS
                        );
                        expect(responseDTO.data.count).to.be.gte(0);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# Fail: no token', (done: Done) => {
                request(app)
                    .get(`${basePath}/perfume/recent`)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.UNAUTHORIZED);
                        const responseDTO: SimpleResponseDTO = res.body;
                        expect(responseDTO.message).to.be.eq(
                            '유효하지 않는 토큰입니다.'
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# recommendPersonalPerfume Test', () => {
            it('success case', (done: Done) => {
                mockPerfumeService.recommendByUser = async () => {
                    return {
                        rows: mockPerfumeKeywordList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/recommend/personal`)
                    .set('x-access-token', 'Bearer ' + user1tokenPerfume)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.OK);
                        const responseDTO: ResponseDTO<
                            ListAndCountDTO<PerfumeRecommendResponse>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            MSG_GET_RECOMMEND_PERFUME_BY_USER
                        );
                        expect(responseDTO.data.count).to.be.gte(0);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# Fail: no token', (done: Done) => {
                request(app)
                    .get(`${basePath}/perfume/recommend/personal`)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.UNAUTHORIZED);
                        const responseDTO: SimpleResponseDTO = res.body;
                        expect(responseDTO.message).to.be.eq(
                            '유효하지 않는 토큰입니다.'
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# recommendCommonPerfume Test', () => {
            it('success case', (done: Done) => {
                mockPerfumeService.recommendByUser = async () => {
                    return {
                        rows: mockPerfumeKeywordList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/recommend/common`)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.OK);
                        const responseDTO: ResponseDTO<
                            ListAndCountDTO<PerfumeRecommendResponse>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            MSG_GET_RECOMMEND_PERFUME_BY_AGE_AND_GENDER
                        );
                        expect(responseDTO.data.count).to.be.gte(0);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# getSurveyPerfume Test', () => {
            it('success case', (done: Done) => {
                mockPerfumeService.getSurveyPerfume = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/survey`)
                    .set('x-access-token', 'Bearer ' + user1tokenPerfume)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.OK);
                        const responseDTO: ResponseDTO<
                            ListAndCountDTO<PerfumeResponse>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            MSG_GET_PERFUME_FOR_SURVEY_SUCCESS
                        );
                        expect(responseDTO.data.count).to.be.gte(0);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# getNewPerfume Test', () => {
            it('success case', (done: Done) => {
                mockPerfumeService.getNewPerfume = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/new`)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(200);
                        const responseDTO: ResponseDTO<
                            ListAndCountDTO<PerfumeResponse>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            MSG_GET_ADDED_PERFUME_RECENT_SUCCESS
                        );
                        expect(responseDTO.data.count).to.be.gte(0);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
    });
});