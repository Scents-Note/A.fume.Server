import dotenv from 'dotenv';
import { Done } from 'mocha';
import request from 'supertest';
import { expect } from 'chai';
dotenv.config();
import sinon from 'sinon';

import StatusCode from '@utils/statusCode';
import * as opensearch from '@utils/opensearch';

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
    MSG_GET_RECOMMEND_SIMILAR_PERFUMES,
    BASE_PATH,
    MSG_POST_PERFUME_RECOMMEND_SIMMILAR_SUCCESS,
} from '@utils/strings';

import {
    DEFAULT_RECOMMEND_REQUEST_SIZE,
    DEFAULT_RECENT_ADDED_PERFUME_REQUEST_SIZE,
} from '@utils/constants';

import { OpCode, ResponseDTO, SimpleResponseDTO } from '@response/common';
import {
    PerfumeResponse,
    PerfumeDetailResponse,
    PerfumeRecommendResponse,
} from '@response/perfume';

import { ListAndCountDTO, PerfumeThumbKeywordDTO } from '@dto/index';

import app from '@src/app';

const basePath: string = BASE_PATH;

import UserService from '@services/UserService';

import { encrypt } from '@libs/crypto';

describe('# Perfume Integral Test', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('# with Token Test', () => {
        var user1token: string;
        var user1idx: number;
        before(async () => {
            const user = await new UserService().loginUser(
                process.env.TEST_ACCOUNT_ID!!,
                encrypt(process.env.TEST_ACCOUNT_PWD!!)
            );
            user1token = user.token;
            user1idx = user.userIdx;
        });
        describe('# likePerfume Test', () => {
            it('success case', (done: Done) => {
                request(app)
                    .post(`${basePath}/perfume/1/like`)
                    .set('x-access-token', 'Bearer ' + user1token)
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
                request(app)
                    .get(`${basePath}/user/${user1idx}/perfume/liked`)
                    .set('x-access-token', 'Bearer ' + user1token)
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
                    .set('x-access-token', 'Bearer ' + user1token)
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
                request(app)
                    .get(`${basePath}/perfume/recent`)
                    .set('x-access-token', 'Bearer ' + user1token)
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
            it('# with no token', (done: Done) => {
                request(app)
                    .get(`${basePath}/perfume/recommend/personal`)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.OK);
                        const responseDTO: ResponseDTO<
                            ListAndCountDTO<PerfumeThumbKeywordDTO>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            MSG_GET_RECOMMEND_PERFUME_BY_USER
                        );
                        expect(responseDTO.data.count).to.be.eq(
                            DEFAULT_RECOMMEND_REQUEST_SIZE
                        );
                        expect(responseDTO.data.rows.length).to.be.eq(
                            DEFAULT_RECOMMEND_REQUEST_SIZE
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
        describe('# recommendCommonPerfume Test', () => {
            it('success case', (done: Done) => {
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
                        expect(responseDTO.data.count).to.be.gte(15);
                        expect(responseDTO.data.rows.length).to.be.eq(15);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
        describe('# getSurveyPerfume Test', () => {
            it('success case', (done: Done) => {
                request(app)
                    .get(`${basePath}/perfume/survey`)
                    .set('x-access-token', 'Bearer ' + user1token)
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

        describe('# recommendPersonalPerfume Test', () => {
            it('success case', (done: Done) => {
                request(app)
                    .get(`${basePath}/perfume/recommend/personal`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.OK);
                        const responseDTO: ResponseDTO<
                            ListAndCountDTO<PerfumeRecommendResponse>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            MSG_GET_RECOMMEND_PERFUME_BY_USER
                        );
                        expect(responseDTO.data.count).to.be.eq(
                            DEFAULT_RECOMMEND_REQUEST_SIZE
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# success case: but less than default recommend size', (done: Done) => {
                request(app)
                    .get(`${basePath}/perfume/recommend/personal`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.OK);
                        const responseDTO: ResponseDTO<
                            ListAndCountDTO<PerfumeResponse>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            MSG_GET_RECOMMEND_PERFUME_BY_USER
                        );
                        expect(responseDTO.data.count).to.be.eq(
                            DEFAULT_RECOMMEND_REQUEST_SIZE
                        );
                        expect(responseDTO.data.rows.length).to.be.eq(
                            DEFAULT_RECOMMEND_REQUEST_SIZE
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
    });
    describe('# without Token Test', () => {
        it('# getPerfume_success', (done: Done) => {
            request(app)
                .get(`${basePath}/perfume/1`)
                .expect((res: request.Response) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const result: ResponseDTO<PerfumeDetailResponse> = res.body;
                    expect(result.message).to.be.eq(
                        MSG_GET_PERFUME_DETAIL_SUCCESS
                    );
                    result.data.volumeAndPrice.forEach(
                        (volumeAndPrice: string) => {
                            expect(volumeAndPrice).to.be.not.contain('NaN');
                        }
                    );
                    done();
                })
                .catch((err: Error) => done(err));
        });
        describe('# searchPerfume Test', () => {
            beforeEach(() => {
                sandbox.stub(opensearch, 'requestPerfumeSearch').resolves({
                    body: { hits: { total: { value: 1 }, hits: [] } },
                });
            });
            const tests = [
                {
                    args: {
                        searchText: 'Tom',
                        keywordList: [],
                        ingredientList: [],
                        brandList: [],
                    },
                    expected: 0,
                },
                {
                    args: {
                        searchText: 'Chanel',
                        keywordList: [],
                        ingredientList: [],
                        brandList: [],
                    },
                    expected: 62,
                },
            ];
            let i = 0;
            tests.forEach(({ args, expected }) => {
                it(`searchPerfumeTest case ${i++}`, () => {
                    request(app)
                        .post(`${basePath}/perfume/search`)
                        .send(args)
                        .expect((res: request.Response) => {
                            expect(res.status).to.be.eq(StatusCode.OK);
                            const result: ResponseDTO<
                                ListAndCountDTO<PerfumeResponse>
                            > = res.body;
                            expect(result.message).to.be.eq(
                                MSG_GET_SEARCH_PERFUME_SUCCESS
                            );
                            expect(result.data!!.count).to.be.gte(expected);
                        });
                });
            });
        });
        describe('# getNewPerfume Test', () => {
            it('success case', (done: Done) => {
                request(app)
                    .get(`${basePath}/perfume/new`)
                    .expect((res: request.Response) => {
                        expect(res.status).to.be.eq(StatusCode.OK);
                        const responseDTO: ResponseDTO<
                            ListAndCountDTO<PerfumeResponse>
                        > = res.body;
                        expect(responseDTO.message).to.be.eq(
                            MSG_GET_ADDED_PERFUME_RECENT_SUCCESS
                        );
                        expect(responseDTO.data.count).to.be.gte(
                            DEFAULT_RECENT_ADDED_PERFUME_REQUEST_SIZE
                        );
                        expect(responseDTO.data.rows.length).to.be.gte(
                            DEFAULT_RECENT_ADDED_PERFUME_REQUEST_SIZE
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
        describe('# recommendSimilarPerfume Test', () => {
            it('update success case', async () => {
                const res: request.Response = await request(app)
                    .post(`${basePath}/perfume/recommend/simmilar`)
                    .send({ 10: [1, 2, 3] });

                const responseDTO: ResponseDTO<
                    ListAndCountDTO<PerfumeRecommendResponse>
                > = res.body;

                expect(res.status).to.be.eq(StatusCode.OK);
                expect(responseDTO.message).to.be.eq(
                    MSG_POST_PERFUME_RECOMMEND_SIMMILAR_SUCCESS
                );
                expect(responseDTO.opcode).to.be.eq(OpCode.NONE);
            });

            it('read success case', async () => {
                const res: request.Response = await request(app).get(
                    `${basePath}/perfume/10/similar`
                );

                const responseDTO: ResponseDTO<
                    ListAndCountDTO<PerfumeRecommendResponse>
                > = res.body;

                expect(res.status).to.be.eq(StatusCode.OK);
                expect(responseDTO.message).to.be.eq(
                    MSG_GET_RECOMMEND_SIMILAR_PERFUMES
                );
                expect(responseDTO.data.count).to.be.eq(3);
                expect(responseDTO.opcode).to.be.eq(OpCode.NONE);
            });
        });
    });
});
