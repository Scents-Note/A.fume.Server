import { expect } from 'chai';
import dotenv from 'dotenv';
import { Done } from 'mocha';

dotenv.config();

import PerfumeService from '@services/PerfumeService';

import { GENDER_MAN, GENDER_WOMAN, GRADE_USER } from '@utils/constants';

import {
    ListAndCountDTO,
    PagingDTO,
    PerfumeIntegralDTO,
    PerfumeSearchDTO,
    PerfumeSearchResultDTO,
    PerfumeThumbDTO,
    PerfumeThumbWithReviewDTO,
} from '@dto/index';

import {
    GenderProperty,
    LongevityProperty,
    SeasonalProperty,
    SillageProperty,
} from '@vo/ReviewProperty';

import PerfumeIntegralMockHelper from '../mock_helper/PerfumeIntegralMockHelper';
import { LikePerfumeService } from '@src/service/LikePerfumeService';
import ImageService from '@src/service/ImageService';
import KeywordService from '@src/service/KeywordService';

const mockLikePerfumeDao: any = {};
const mockS3FileDao: any = {};
const mockKeywordDao: any = {};
const LikePerfume = new LikePerfumeService(mockLikePerfumeDao);
const Image = new ImageService(mockS3FileDao);
const Keyword = new KeywordService(mockKeywordDao, LikePerfume);
const Perfume: PerfumeService = new PerfumeService(LikePerfume, Image, Keyword);

const defaultPagingDTO: PagingDTO = PagingDTO.createByJson({});

const mockUserDao: any = {};
Perfume.setUserDao(mockUserDao);

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
                            access: 1,
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
                            access: 0,
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
                            access: 1,
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
                            access: 1,
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
    describe('# updateSimilarPerfumes Test', async () => {
        it('# Success Case', async () => {
            const result = await Perfume.updateSimilarPerfumes({
                10: [1, 2, 3],
            });
            expect(result.length).to.be.eq(4);
        });
    });
    describe('# getRecommendedSimilarPerfumeList Test', async () => {
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

        it('# Success Case 1: If perfumeIdxList is not empty', async () => {
            const result = await Perfume.getRecommendedSimilarPerfumeList(
                10,
                2
            );
            expect(result.count).to.be.eq(2);
            expect(result.rows.length).to.be.eq(2);
        });
        it('# Success Case 2: If perfumeIdxList is empty', async () => {
            const result = await Perfume.getRecommendedSimilarPerfumeList(0, 2);
            expect(result.count).to.be.eq(2);
            expect(result.rows.length).to.be.eq(2);
        });
    });
});
