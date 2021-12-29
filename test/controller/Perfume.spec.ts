import dotenv from 'dotenv';
import request from 'supertest';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import JwtController from '../../src/lib/JwtController';
import TokenPayloadDTO from '../../src/data/dto/TokenPayloadDTO';
import StatusCode from '../../src/utils/statusCode';

const app: any = require('../../src/index.js');

const basePath: string = '/A.fume/api/0.0.1';

const Perfume = require('../../src/controllers/Perfume');
import PerfumeThumbMockHelper from '../data/dto/PerfumeThumbMockHelper';
import PerfumeThumbKeywordMockHelper from '../data/dto/PerfumeThumbKeywordMockHelper';
import PerfumeIntegralMockHelper from '../data/dto/PerfumeIntegralMockHelper';
import ListAndCountDTO from '../../src/data/dto/ListAndCountDTO';
import { ResponseDTO, SimpleResponseDTO } from '../../src/data/response/common';
import {
    PerfumeResponseDTO,
    PerfumeDetailResponseDTO,
    PerfumeRecommendResponseDTO,
} from '../../src/data/response/perfume';

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
                    const result: ResponseDTO<PerfumeDetailResponseDTO> =
                        res.body;
                    expect(result.message).to.be.eq('향수 조회 성공');
                    done();
                })
                .catch((err) => done(err));
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
                            ListAndCountDTO<PerfumeResponseDTO>
                        > = res.body;
                        expect(result.message).to.be.eq('향수 검색 성공');
                        expect(result.data!!.count).to.be.gte(0);
                        done();
                    })
                    .catch((err) => done(err));
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
                            '향수 좋아요' + (responseDTO.data ? '' : ' 취소')
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
                            ListAndCountDTO<PerfumeResponseDTO>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            '유저가 좋아요한 향수 조회'
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
                            '비정상적인 접근입니다.'
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
                            ListAndCountDTO<PerfumeResponseDTO>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            '최근 검색한 향수 조회'
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
                            ListAndCountDTO<PerfumeRecommendResponseDTO>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            '향수 개인 맞춤 추천'
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
                            ListAndCountDTO<PerfumeRecommendResponseDTO>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            '향수 일반 추천 (성별, 나이 반영)'
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
                            ListAndCountDTO<PerfumeResponseDTO>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            '서베이 향수 조회 성공'
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
                            ListAndCountDTO<PerfumeResponseDTO>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            '새로 등록된 향수 조회 성공'
                        );
                        expect(responseDTO.data.count).to.be.gte(0);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
    });
});
