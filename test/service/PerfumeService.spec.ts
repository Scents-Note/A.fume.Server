import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';

dotenv.config();

import PerfumeService from '@services/PerfumeService';

import { NotMatchedError } from '@errors';

import { GENDER_WOMAN } from '@utils/constants';

import { PagingRequestDTO } from '@request/common';

import {
    ListAndCountDTO,
    PagingDTO,
    PerfumeSummaryDTO,
    PerfumeIntegralDTO,
    PerfumeSearchResultDTO,
    PerfumeSearchDTO,
    PerfumeDefaultReviewDTO,
    PerfumeThumbDTO,
    PerfumeThumbKeywordDTO,
} from '@dto/index';

import PerfumeIntegralMockHelper from '../mock_helper/PerfumeIntegralMockHelper';

const Perfume: PerfumeService = new PerfumeService();

const mockS3FileDao: any = {};
Perfume.setS3FileDao(mockS3FileDao);

const mockLikePerfumeDao: any = {};
Perfume.setLikePerfumeDao(mockLikePerfumeDao);

const mockUserDao: any = {};
Perfume.setUserDao(mockUserDao);

const mockKeywordDao: any = {};
Perfume.setKeywordDao(mockKeywordDao);

const mockReviewDao: any = {};
Perfume.setReviewDao(mockReviewDao);

const mockDefaultReviewDao: any = {};
Perfume.setDefaultReviewDao(mockDefaultReviewDao);

describe('# Perfume Service Test', () => {
    before(async function () {
        await require('../dao/common/presets.js')(this);
    });
    describe('# read Test', () => {
        describe('# read detail Test', () => {
            it('# success Test', (done: Done) => {
                mockS3FileDao.getS3ImageList = async () => {
                    return ['imageUrl1', 'imageUrl2'];
                };
                mockLikePerfumeDao.read = async (_: number, __: number) => {
                    return false;
                };
                mockKeywordDao.readAllOfPerfume = async (_: number) => {
                    return [{ name: '키워드1' }, { name: '키워드2' }];
                };
                const expectedReviewIdx: number = 4;
                mockReviewDao.findOne = async () => {
                    return { id: expectedReviewIdx };
                };
                mockDefaultReviewDao.readByPerfumeIdx = async () => {
                    return PerfumeDefaultReviewDTO.createByJson({
                        perfumeIdx: 1,
                        rating: 2,
                        seasonal: {
                            spring: 1,
                            summer: 1,
                            fall: 1,
                            winter: 1,
                        },
                        sillage: {
                            light: 25,
                            medium: 50,
                            heavy: 21,
                        },
                        longevity: {
                            veryWeak: 1,
                            weak: 9,
                            normal: 8,
                            strong: 3,
                            veryStrong: 6,
                        },
                        gender: {
                            male: 2,
                            neutral: 2,
                            female: 1,
                        },
                        keywordList: [
                            { id: 3, name: '키워드3' },
                            { id: 1, name: '키워드1' },
                            { id: 4, name: '키워드4' },
                        ],
                    });
                };
                mockReviewDao.readAllOfPerfume = async () => {
                    return [
                        {
                            reviewIdx: 1,
                            score: 1,
                            longevity: 1,
                            sillage: 1,
                            seasonal: 4,
                            gender: 1,
                            access: 1,
                            content: '시향노트1',
                            createdAt: '2021-09-26T08:38:33.000Z',
                            User: {
                                userIdx: 1,
                                email: 'email1@afume.com',
                                nickname: 'user1',
                                password: 'test',
                                gender: 2,
                                birth: 1995,
                                grade: 1,
                                accessTime: '2021-09-26T08:38:33.000Z',
                            },
                            LikeReview: { likeCount: 1 },
                        },
                    ];
                };
                Perfume.getPerfumeById(1, 1)
                    .then((it: PerfumeIntegralDTO) => {
                        PerfumeIntegralMockHelper.validTest.call(it);
                        expect(it.imageUrls).to.be.deep.eq([
                            'http://perfume-image/1',
                            'imageUrl1',
                            'imageUrl2',
                        ]);
                        expect(it.keywordList).to.be.deep.eq([
                            '키워드1',
                            '키워드2',
                            '키워드3',
                            '키워드4',
                        ]);
                        expect(it.reviewIdx).to.be.eq(expectedReviewIdx);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# with defaultReview Test', (done: Done) => {
                mockS3FileDao.getS3ImageList = async () => [];
                mockLikePerfumeDao.read = async (_: number, __: number) =>
                    false;
                mockKeywordDao.readAllOfPerfume = async (_: number) => {
                    return [{ name: '키워드1' }, { name: '키워드2' }];
                };
                const expectedReviewIdx: number = 4;
                mockReviewDao.findOne = async () => {
                    return { id: expectedReviewIdx };
                };
                const mockDefaultReview: any =
                    PerfumeDefaultReviewDTO.createByJson({
                        perfumeIdx: 1,
                        rating: 5,
                        seasonal: {
                            spring: 0,
                            summer: 0,
                            fall: 100,
                            winter: 100,
                        },
                        sillage: {
                            light: 0,
                            medium: 100,
                            heavy: 100,
                        },
                        longevity: {
                            veryWeak: 0,
                            weak: 0,
                            normal: 0,
                            strong: 100,
                            veryStrong: 100,
                        },
                        gender: {
                            male: 0,
                            neutral: 100,
                            female: 100,
                        },
                        keywordList: [
                            { id: 3, name: '키워드3' },
                            { id: 1, name: '키워드1' },
                            { id: 4, name: '키워드4' },
                        ],
                    });
                mockDefaultReviewDao.readByPerfumeIdx = async () => {
                    return mockDefaultReview;
                };
                const mockReviewList: any[] = [
                    {
                        reviewIdx: 1,
                        score: 1,
                        longevity: 1,
                        sillage: 1,
                        seasonal: 1,
                        gender: 1,
                        access: 1,
                        content: '시향노트1',
                        createdAt: '2021-09-26T08:38:33.000Z',
                        User: {
                            userIdx: 1,
                            email: 'email1@afume.com',
                            nickname: 'user1',
                            password: 'test',
                            gender: 2,
                            birth: 1995,
                            grade: 1,
                            accessTime: '2021-09-26T08:38:33.000Z',
                        },
                        LikeReview: { likeCount: 1 },
                    },
                ];
                mockReviewDao.readAllOfPerfume = async () => {
                    return mockReviewList;
                };
                Perfume.getPerfumeById(1, 1)
                    .then((it: PerfumeIntegralDTO) => {
                        PerfumeIntegralMockHelper.validTest.call(it);

                        expect(it.keywordList).to.be.deep.eq([
                            '키워드1',
                            '키워드2',
                            '키워드3',
                            '키워드4',
                        ]);
                        expect(it.reviewIdx).to.be.eq(expectedReviewIdx);
                        const defaultReviewRate: number =
                            Perfume.getDefaultReviewRate(mockReviewList.length);
                        const defaultSummary: PerfumeSummaryDTO =
                            PerfumeSummaryDTO.createByDefault(
                                mockDefaultReview
                            );
                        const userSummary: PerfumeSummaryDTO =
                            PerfumeSummaryDTO.createByReviewList(
                                mockReviewList
                            );
                        const expectedScore: number =
                            defaultSummary.score * defaultReviewRate +
                            userSummary.score * (1 - defaultReviewRate);
                        expect(it.score).to.be.eq(expectedScore);
                        expect(it.seasonal).to.be.deep.eq({
                            spring: 2,
                            summer: 2,
                            fall: 49,
                            winter: 47,
                        });
                        expect(it.sillage).to.be.deep.eq({
                            light: 3,
                            medium: 48,
                            heavy: 49,
                        });
                        expect(it.longevity).to.be.deep.eq({
                            veryWeak: 1,
                            weak: 1,
                            normal: 1,
                            strong: 50,
                            veryStrong: 47,
                        });
                        expect(it.gender).to.be.deep.eq({
                            male: 3,
                            neutral: 48,
                            female: 49,
                        });
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# without defaultReview Test', (done: Done) => {
                mockS3FileDao.getS3ImageList = async () => {
                    return ['imageUrl1', 'imageUrl2'];
                };
                mockLikePerfumeDao.read = async (_: number, __: number) => {
                    return false;
                };
                mockKeywordDao.readAllOfPerfume = async (_: number) => {
                    return [{ name: '키워드1' }, { name: '키워드2' }];
                };
                const expectedReviewIdx: number = 4;
                mockReviewDao.findOne = async () => {
                    return { id: expectedReviewIdx };
                };
                mockDefaultReviewDao.readByPerfumeIdx = async () => {
                    throw new NotMatchedError();
                };
                mockReviewDao.readAllOfPerfume = async () => {
                    return [
                        {
                            reviewIdx: 1,
                            score: 1,
                            longevity: 1,
                            sillage: 1,
                            seasonal: 4,
                            gender: 1,
                            access: 1,
                            content: '시향노트1',
                            createdAt: '2021-09-26T08:38:33.000Z',
                            User: {
                                userIdx: 1,
                                email: 'email1@afume.com',
                                nickname: 'user1',
                                password: 'test',
                                gender: 2,
                                birth: 1995,
                                grade: 1,
                                accessTime: '2021-09-26T08:38:33.000Z',
                            },
                            LikeReview: { likeCount: 1 },
                        },
                    ];
                };
                Perfume.getPerfumeById(1, 1)
                    .then((it: PerfumeIntegralDTO) => {
                        PerfumeIntegralMockHelper.validTest.call(it);
                        expect(it.keywordList).to.be.deep.eq([
                            '키워드1',
                            '키워드2',
                        ]);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        it('# search Test', (done: Done) => {
            mockLikePerfumeDao.readLikeInfo = async (
                userIdx: number,
                __: any
            ) => {
                return [{ userIdx, perfumeIdx: 2 }];
            };
            const perfumeSearchDTO: PerfumeSearchDTO = PerfumeSearchDTO.create(
                1,
                {
                    keywordList: [],
                    brandList: [],
                    ingredientList: [],
                    searchText: '',
                }
            );
            const pagingRequestDTO: PagingRequestDTO =
                PagingRequestDTO.createByJson({});
            Perfume.searchPerfume(perfumeSearchDTO, pagingRequestDTO)
                .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# getSurveyPerfume Test', (done: Done) => {
            mockUserDao.readByIdx = async () => ({
                gender: GENDER_WOMAN,
            });
            Perfume.getSurveyPerfume(1)
                .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# recentSearch Test', (done: Done) => {
            const pagingRequestDTO: PagingRequestDTO =
                PagingRequestDTO.createByJson({});
            Perfume.recentSearch(1, pagingRequestDTO)
                .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# recommendByUser Test', (done: Done) => {
            mockUserDao.readByIdx = async () => {
                return {
                    gender: GENDER_WOMAN,
                    birth: 1995,
                };
            };
            mockLikePerfumeDao.readLikeInfo = async (
                userIdx: number,
                _: number[]
            ) => {
                return [
                    { userIdx, perfumeIdx: 1 },
                    { userIdx, perfumeIdx: 2 },
                    { userIdx, perfumeIdx: 3 },
                    { userIdx, perfumeIdx: 4 },
                    { userIdx, perfumeIdx: 5 },
                ];
            };
            mockKeywordDao.readAllOfPerfumeIdxList = async (_: number[]) => {
                return [
                    {
                        perfumeIdx: 1,
                        Keyword: { name: '키워드1' },
                    },
                    {
                        perfumeIdx: 1,
                        Keyword: { name: '키워드2' },
                    },
                    {
                        perfumeIdx: 2,
                        Keyword: { name: '키워드3' },
                    },
                    {
                        perfumeIdx: 3,
                        Keyword: { name: '키워드2' },
                    },
                ];
            };
            const pagingRequestDTO: PagingRequestDTO =
                PagingRequestDTO.createByJson({});
            Perfume.recommendByUser(1, pagingRequestDTO)
                .then((result: ListAndCountDTO<PerfumeThumbKeywordDTO>) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    for (const item of result.rows) {
                        switch (item.perfumeIdx) {
                            case 1:
                                expect(item.keywordList).to.be.deep.eq([
                                    '키워드1',
                                    '키워드2',
                                ]);
                                break;
                            case 2:
                                expect(item.keywordList).to.be.deep.eq([
                                    '키워드3',
                                ]);
                                break;
                            case 3:
                                expect(item.keywordList).to.be.deep.eq([
                                    '키워드2',
                                ]);
                                break;
                            default:
                                expect(item.keywordList).to.be.deep.eq([]);
                                break;
                        }
                    }
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# getNewPerfume Test', (done: Done) => {
            const pagingDTO: PagingDTO = PagingDTO.createByJson({});
            mockLikePerfumeDao.readLikeInfo = async (
                userIdx: number,
                _: number[]
            ) => {
                return [{ userIdx, perfumeIdx: 2 }];
            };
            Perfume.getNewPerfume(1, pagingDTO)
                .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# getLikedPerfume Test', (done: Done) => {
            const pagingRequestDTO: PagingRequestDTO =
                PagingRequestDTO.createByJson({});
            mockLikePerfumeDao.readLikeInfo = async (
                userIdx: number,
                perfumeIdxList: number[]
            ) => {
                return perfumeIdxList.map((perfumeIdx: number) => ({
                    userIdx,
                    perfumeIdx,
                }));
            };
            Perfume.getLikedPerfume(1, pagingRequestDTO)
                .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    result.rows.forEach((item) => {
                        expect(item.isLiked).to.be.true;
                    });
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
    describe('# like Test', () => {
        it('# likePerfume Test (좋아요)', (done: Done) => {
            mockLikePerfumeDao.read = async (_: number, __: number) => {
                throw new NotMatchedError();
            };
            mockLikePerfumeDao.delete = async (_: number, __: number) => {
                return;
            };
            mockLikePerfumeDao.create = async (_: number, __: number) => {
                return;
            };
            Perfume.likePerfume(1, 1)
                .then((result: boolean) => {
                    expect(result).to.be.true;
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# likePerfume Test (좋아요 취소)', (done: Done) => {
            mockLikePerfumeDao.read = async (_: number, __: number) => {
                return true;
            };
            mockLikePerfumeDao.delete = async (_: number, __: number) => {
                return;
            };
            mockLikePerfumeDao.create = async (_: number, __: number) => {
                return;
            };
            Perfume.likePerfume(1, 1)
                .then((result: boolean) => {
                    expect(result).to.be.false;
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
