const dotenv = require('dotenv');
dotenv.config();

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../../index.js');

const basePath = '/A.fume/api/0.0.1';

const Perfume = require('../../controllers/Perfume.js');
const PerfumeDetailResponseDTO = require('../data/response_dto/perfume/PerfumeDetailResponseDTO');
const PerfumeResponseDTO = require('../data/response_dto/perfume/PerfumeResponseDTO');

const token = require('../../lib/token');
const user1token = token.create({ userIdx: 1 });

const mockPerfumeService = {};
const mockSearchHistoryService = {};
const mockPerfumeList = [
    {
        perfumeIdx: 2475,
        name: 'White Patchouli Tom Ford for women',
        imageUrl:
            'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2475/1.jpg',
        brandName: '톰 포드',
        isLiked: false,
    },
    {
        perfumeIdx: 2474,
        name: 'Violet Blonde Tom Ford for women',
        imageUrl:
            'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2474/1.jpg',
        brandName: '톰 포드',
        isLiked: false,
    },
    {
        perfumeIdx: 2473,
        name: 'Tom Ford for Men Extreme Tom Ford for men',
        imageUrl:
            'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2473/1.jpg',
        brandName: '톰 포드',
        isLiked: false,
    },
    {
        perfumeIdx: 2472,
        name: 'Tom Ford for Men Tom Ford for men',
        imageUrl:
            'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2472/1.jpg',
        brandName: '톰 포드',
        isLiked: false,
    },
    {
        perfumeIdx: 2471,
        name: 'Sahara Noir Tom Ford for women',
        imageUrl:
            'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2471/1.jpg',
        brandName: '톰 포드',
        isLiked: false,
    },
    {
        perfumeIdx: 2470,
        name: 'Ombré Leather (2018) Tom Ford for women and men',
        imageUrl:
            'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2470/1.jpg',
        brandName: '톰 포드',
        isLiked: false,
    },
    {
        perfumeIdx: 2469,
        name: 'Metallique Tom Ford for women',
        imageUrl:
            'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2469/1.jpg',
        brandName: '톰 포드',
        isLiked: false,
    },
    {
        perfumeIdx: 2468,
        name: 'Beau De Jour Eau de Parfum Tom Ford for men',
        imageUrl:
            'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2468/1.jpg',
        brandName: '톰 포드',
        isLiked: false,
    },
    {
        perfumeIdx: 2467,
        name: 'Eau de Vert Boheme Tom Ford for women',
        imageUrl:
            'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2467/1.jpg',
        brandName: '톰 포드',
        isLiked: false,
    },
    {
        perfumeIdx: 2466,
        name: 'Eau de Jasmin Rouge Tom Ford for women',
        imageUrl:
            'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2466/1.jpg',
        brandName: '톰 포드',
        isLiked: false,
    },
];
Perfume.setPerfumeService(mockPerfumeService);
Perfume.setSearchHistoryService(mockSearchHistoryService);

describe('# Perfume Controller Test', () => {
    describe('# getPerfume Test', () => {
        it('success case', (done) => {
            mockPerfumeService.getPerfumeById = async () => {
                return {
                    perfumeIdx: 1,
                    name: '향수1',
                    brandName: '브랜드1',
                    story: '스토리1',
                    abundanceRate: '오 드 코롱',
                    volumeAndPrice: [],
                    isLiked: false,
                    Keywords: [],
                    imageUrls: [],
                    noteType: 0,
                    ingredients: {
                        top: '재료1, 재료1, 재료1, 재료1',
                        middle: '재료1',
                        base: '',
                        single: '',
                    },
                    score: 1,
                    seasonal: {
                        spring: 15,
                        summer: 0,
                        fall: 78,
                        winter: 7,
                    },
                    sillage: {
                        light: 7,
                        medium: 86,
                        heavy: 7,
                    },
                    longevity: {
                        veryWeak: 93,
                        weak: 0,
                        normal: 0,
                        strong: 7,
                        veryStrong: 0,
                    },
                    gender: {
                        male: 7,
                        neutral: 7,
                        female: 86,
                    },
                };
            };
            mockSearchHistoryService.incrementCount = async () => {};

            request(app)
                .get(`${basePath}/perfume/1`)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('향수 조회 성공');
                    PerfumeDetailResponseDTO.validTest.call(data);
                    done();
                })
                .catch((err) => done(err));
        });
        describe('# searchPerfume Test', () => {
            it('success case', (done) => {
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
                    .expect((res) => {
                        expect(res.status).to.be.eq(200);
                        const { message, data } = res.body;
                        expect(message).to.be.eq('향수 검색 성공');
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# likePerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.likePerfume = async () => true;
                request(app)
                    .post(`${basePath}/perfume/1/like`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res) => {
                        expect(res.status).to.be.eq(200);
                        const { message, data } = res.body;
                        expect(message).to.be.eq(
                            '향수 좋아요' + (data ? '' : ' 취소')
                        );
                        expect(data).to.be.not.undefined;
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# getLikedPerfume Test', () => {
            it('# success case', (done) => {
                mockPerfumeService.getLikedPerfume = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 204,
                    };
                };

                request(app)
                    .get(`${basePath}/user/1/perfume/liked`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res) => {
                        expect(res.status).to.be.eq(200);
                        const { message, data } = res.body;
                        expect(message).to.be.eq('유저가 좋아요한 향수 조회');
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# Fail: 유저 id 불일치', (done) => {
                request(app)
                    .get(`${basePath}/user/2/perfume/liked`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res) => {
                        expect(res.status).to.be.eq(403);
                        const { message } = res.body;
                        expect(message).to.be.eq('비정상적인 접근입니다.');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# getRecentPerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.recentSearch = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/recent`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res) => {
                        expect(res.status).to.be.eq(200);
                        const { message, data } = res.body;
                        expect(message).to.be.eq('최근 검색한 향수 조회');
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# Fail: no token', (done) => {
                request(app)
                    .get(`${basePath}/perfume/recent`)
                    .expect((res) => {
                        expect(res.status).to.be.eq(401);
                        const { message } = res.body;
                        expect(message).to.be.eq('유효하지 않는 토큰입니다.');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# recommendPersonalPerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.recommendByUser = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/recommend/personal`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res) => {
                        expect(res.status).to.be.eq(200);
                        const { message, data } = res.body;
                        expect(message).to.be.eq('향수 개인 맞춤 추천');
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# Fail: no token', (done) => {
                request(app)
                    .get(`${basePath}/perfume/recommend/personal`)
                    .expect((res) => {
                        expect(res.status).to.be.eq(401);
                        const { message } = res.body;
                        expect(message).to.be.eq('유효하지 않는 토큰입니다.');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# recommendCommonPerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.recommendByUser = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/recommend/common`)
                    .expect((res) => {
                        expect(res.status).to.be.eq(200);
                        const { message, data } = res.body;
                        expect(message).to.be.eq(
                            '향수 일반 추천 (성별, 나이 반영)'
                        );
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# getSurveyPerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.getSurveyPerfume = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/survey`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res) => {
                        expect(res.status).to.be.eq(200);
                        const { message, data } = res.body;
                        expect(message).to.be.eq('서베이 향수 조회 성공');
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# getNewPerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.getNewPerfume = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/new`)
                    .expect((res) => {
                        expect(res.status).to.be.eq(200);
                        const { message, data } = res.body;
                        expect(message).to.be.eq('새로 등록된 향수 조회 성공');
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });
});
