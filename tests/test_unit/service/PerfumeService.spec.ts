import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';

dotenv.config();

import PerfumeService from '@services/PerfumeService';

import { NotMatchedError } from '@errors';

import {
    GENDER_MAN,
    GRADE_USER,
    GENDER_WOMAN,
    ACCESS_PUBLIC,
    ACCESS_PRIVATE,
} from '@utils/constants';

import {
    ListAndCountDTO,
    PagingDTO,
    PerfumeIntegralDTO,
    PerfumeSearchResultDTO,
    PerfumeSearchDTO,
    PerfumeThumbDTO,
    PerfumeThumbKeywordDTO,
    PerfumeThumbWithReviewDTO,
} from '@dto/index';

import {
    LongevityProperty,
    SillageProperty,
    GenderProperty,
    SeasonalProperty,
} from '@vo/ReviewProperty';

import PerfumeIntegralMockHelper from '../mock_helper/PerfumeIntegralMockHelper';

const Perfume: PerfumeService = new PerfumeService();

const defaultPagingDTO: PagingDTO = PagingDTO.createByJson({});

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
                mockReviewDao.readAllOfPerfume = async () => {
                    return [
                        {
                            reviewIdx: 1,
                            score: 1,
                            longevity: LongevityProperty.veryWeak.value,
                            sillage: SillageProperty.light.value,
                            seasonal: SeasonalProperty.fall.value,
                            gender: GenderProperty.male.value,
                            access: ACCESS_PUBLIC,
                            content: '시향노트1',
                            createdAt: '2021-09-26T08:38:33.000Z',
                            User: {
                                userIdx: 1,
                                email: 'email1@afume.com',
                                nickname: 'user1',
                                password: 'test',
                                gender: GENDER_MAN,
                                birth: 1995,
                                grade: GRADE_USER,
                                accessTime: '2021-09-26T08:38:33.000Z',
                            },
                            LikeReview: { likeCount: 1 },
                        },
                        {
                            reviewIdx: 2,
                            score: 5,
                            longevity: LongevityProperty.veryWeak.value,
                            sillage: SillageProperty.light.value,
                            seasonal: SeasonalProperty.fall.value,
                            gender: GenderProperty.male.value,
                            access: ACCESS_PRIVATE,
                            content: '시향노트1',
                            createdAt: '2021-09-26T08:38:33.000Z',
                            User: {
                                userIdx: 1,
                                email: 'email1@afume.com',
                                nickname: 'user1',
                                password: 'test',
                                gender: GENDER_WOMAN,
                                birth: 1995,
                                grade: GRADE_USER,
                                accessTime: '2021-09-26T08:38:33.000Z',
                            },
                            LikeReview: { likeCount: 1 },
                        },
                    ];
                };
                mockReviewDao.readAllMineOfPerfumes = async () => {
                    return [
                        {
                            id: 1,
                            score: 1,
                            longevity: 1,
                            sillage: 1,
                            seasonal: 4,
                            gender: 1,
                            access: 1,
                            content: '시향노트1',
                            likeCnt: 0,
                            createdAt: '2021-09-26T08:38:33.000Z',
                            updatedAt: '2022-06-01T11:09:46.000Z',
                            deletedAt: null,
                            perfumeIdx: 1,
                            userIdx: 1,
                        },
                    ];
                };
                Perfume.getPerfumeById(1, 1)
                    .then((it: PerfumeIntegralDTO) => {
                        PerfumeIntegralMockHelper.validTest.call(it);
                        expect(['imageUrl1', 'imageUrl2']).to.be.deep.eq(
                            it.imageUrls
                        );
                        expect(['키워드1', '키워드2']).to.be.deep.eq(
                            it.keywordList
                        );
                        expect(expectedReviewIdx).to.be.eq(it.reviewIdx);
                        expect(it.score).to.be.eq(3);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# simple test', (done: Done) => {
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
                mockReviewDao.readAllOfPerfume = async () => {
                    return [
                        {
                            reviewIdx: 1,
                            score: 1,
                            longevity: LongevityProperty.veryWeak.value,
                            sillage: SillageProperty.light.value,
                            seasonal: SeasonalProperty.fall.value,
                            gender: GenderProperty.male.value,
                            access: ACCESS_PUBLIC,
                            content: '시향노트1',
                            createdAt: '2021-09-26T08:38:33.000Z',
                            User: {
                                userIdx: 1,
                                email: 'email1@afume.com',
                                nickname: 'user1',
                                password: 'test',
                                gender: GENDER_WOMAN,
                                birth: 1995,
                                grade: GRADE_USER,
                                accessTime: '2021-09-26T08:38:33.000Z',
                            },
                            LikeReview: { likeCount: 1 },
                        },
                        {
                            reviewIdx: 2,
                            score: 5,
                            longevity: LongevityProperty.veryWeak.value,
                            sillage: SillageProperty.light.value,
                            seasonal: SeasonalProperty.fall.value,
                            gender: GenderProperty.male.value,
                            access: ACCESS_PRIVATE,
                            content: '시향노트1',
                            createdAt: '2021-09-26T08:38:33.000Z',
                            User: {
                                userIdx: 1,
                                email: 'email1@afume.com',
                                nickname: 'user1',
                                password: 'test',
                                gender: GENDER_WOMAN,
                                birth: 1995,
                                grade: GRADE_USER,
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

            it('# success Test(case empty)', (done: Done) => {
                mockS3FileDao.getS3ImageList = async () => [];
                mockLikePerfumeDao.read = async (_: number, __: number) =>
                    false;
                mockKeywordDao.readAllOfPerfume = async (_: number) => [];
                const expectedReviewIdx: number = 4;
                mockReviewDao.findOne = async () => {
                    return { id: expectedReviewIdx };
                };
                mockReviewDao.readAllOfPerfume = async () => {
                    return [];
                };
                mockReviewDao.readAllMineOfPerfumes = async () => {
                    return [
                        {
                            id: 1,
                            score: 1,
                            longevity: 1,
                            sillage: 1,
                            seasonal: 4,
                            gender: 1,
                            access: 1,
                            content: '시향노트1',
                            likeCnt: 0,
                            createdAt: '2021-09-26T08:38:33.000Z',
                            updatedAt: '2022-06-01T11:09:46.000Z',
                            deletedAt: null,
                            perfumeIdx: 1,
                            userIdx: 1,
                        },
                    ];
                };
                Perfume.getPerfumeById(1, 1)
                    .then((it: PerfumeIntegralDTO) => {
                        PerfumeIntegralMockHelper.validTest.call(it);
                        expect(it.seasonal.spring).to.be.eq(0);
                        expect(it.seasonal.summer).to.be.eq(0);
                        expect(it.seasonal.fall).to.be.eq(0);
                        expect(it.seasonal.winter).to.be.eq(0);

                        expect(it.longevity.veryWeak).to.be.eq(0);
                        expect(it.longevity.weak).to.be.eq(0);
                        expect(it.longevity.normal).to.be.eq(0);
                        expect(it.longevity.strong).to.be.eq(0);
                        expect(it.longevity.veryStrong).to.be.eq(0);

                        expect(it.sillage.light).to.be.eq(0);
                        expect(it.sillage.medium).to.be.eq(0);
                        expect(it.sillage.heavy).to.be.eq(0);

                        expect(it.gender.male).to.be.eq(0);
                        expect(it.gender.neutral).to.be.eq(0);
                        expect(it.gender.female).to.be.eq(0);
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
            const perfumeSearchDTO: PerfumeSearchDTO = new PerfumeSearchDTO(
                [],
                [],
                [],
                '',
                1
            );
            Perfume.searchPerfume(perfumeSearchDTO, defaultPagingDTO)
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
            Perfume.recentSearch(1, defaultPagingDTO)
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
            Perfume.recommendByUser(1, defaultPagingDTO)
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
            mockLikePerfumeDao.readLikeInfo = async (
                userIdx: number,
                _: number[]
            ) => {
                return [{ userIdx, perfumeIdx: 2 }];
            };
            Perfume.getNewPerfume(1, defaultPagingDTO)
                .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# getLikedPerfume Test', (done: Done) => {
            mockLikePerfumeDao.readLikeInfo = async (
                userIdx: number,
                perfumeIdxList: number[]
            ) => {
                return perfumeIdxList.map((perfumeIdx: number) => ({
                    userIdx,
                    perfumeIdx,
                }));
            };
            mockReviewDao.readAllMineOfPerfumes = async (
                _: number,
                perfumeIdxList: number[]
            ) => {
                return perfumeIdxList.map((perfumeIdx: number) => ({
                    reviewIdx: 0,
                    perfumeIdx,
                }));
            };
            Perfume.getLikedPerfume(1, defaultPagingDTO)
                .then((result: ListAndCountDTO<PerfumeThumbWithReviewDTO>) => {
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
