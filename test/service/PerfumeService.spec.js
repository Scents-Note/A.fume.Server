const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const Perfume = require('../../service/PerfumeService.js');
const PerfumeIntegralDTO = require('../data/dto/PerfumeIntegralDTO');
const PerfumeThumbDTO = require('../data/dto/PerfumeThumbDTO');
const PerfumeThumbKeywordDTO = require('../data/dto/PerfumeThumbKeywordDTO');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO');
const {
    PagingRequestDTO,
    PerfumeSearchRequestDTO,
} = require('../../data/request_dto');
const { NotMatchedError } = require('../../utils/errors/errors.js');
const { GENDER_MAN, GENDER_WOMAN } = require('../../utils/constantUtil.js');

const mockS3FileDao = {};
Perfume.setS3FileDao(mockS3FileDao);

const mockLikePerfumeDao = {};
Perfume.setLikePerfumeDao(mockLikePerfumeDao);

const mockUserDao = {};
Perfume.setUserDao(mockUserDao);

const mockKeywordDao = {};
Perfume.setKeywordDao(mockKeywordDao);

const mockReviewDao = {};
Perfume.setReviewDao(mockReviewDao);

describe('# Perfume Service Test', () => {
    before(async function () {
        await require('../dao/common/presets.js')(this);
    });
    describe('# read Test', () => {
        it('# read detail Test', (done) => {
            mockS3FileDao.getS3ImageList = async () => {
                return ['imageUrl1', 'imageUrl2'];
            };
            mockLikePerfumeDao.read = async (userIdx, perfumeIdx) => {
                return false;
            };
            mockKeywordDao.readAllOfPerfume = async (perfumeIdx) => {
                return [{ name: '키워드1' }, { name: '키워드2' }];
            };
            const expectedReviewIdx = 4;
            mockReviewDao.findOne = async () => {
                return { id: expectedReviewIdx };
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
                .then((it) => {
                    PerfumeIntegralDTO.validTest.call(it);
                    expect(it.imageUrls).to.be.deep.eq([
                        'http://perfume-image/1',
                        'imageUrl1',
                        'imageUrl2',
                    ]);
                    expect(it.keywordList).to.be.deep.eq([
                        '키워드1',
                        '키워드2',
                    ]);
                    expect(it.reviewIdx).to.be.eq(expectedReviewIdx);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# search Test', (done) => {
            mockLikePerfumeDao.readLikeInfo = async (
                userIdx,
                perfumeIdxList
            ) => {
                return [{ userIdx, perfumeIdx: 2 }];
            };
            const perfumeSearchRequestDTO = new PerfumeSearchRequestDTO({
                keywordList: [],
                brandList: [],
                ingredientList: [],
                searchText: '',
                userIdx: 1,
            });
            const pagingRequestDTO = new PagingRequestDTO({
                pagingSize: 100,
                pagingIndex: 1,
                order: null,
            });
            Perfume.searchPerfume({ perfumeSearchRequestDTO, pagingRequestDTO })
                .then((result) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(
                        result,
                        PerfumeThumbDTO.validTest
                    );
                    done();
                })
                .catch((err) => done(err));
        });

        it('# getSurveyPerfume Test', (done) => {
            mockUserDao.readByIdx = async () => ({
                gender: GENDER_WOMAN,
            });
            Perfume.getSurveyPerfume(1)
                .then((result) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(
                        result,
                        PerfumeThumbDTO.validTest
                    );
                    done();
                })
                .catch((err) => done(err));
        });

        it('# recentSearch Test', (done) => {
            const pagingRequestDTO = new PagingRequestDTO({
                pagingSize: 100,
                pagingIndex: 1,
                order: null,
            });
            Perfume.recentSearch({ userIdx: 1, pagingRequestDTO })
                .then((result) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(
                        result,
                        PerfumeThumbDTO.validTest
                    );
                    done();
                })
                .catch((err) => done(err));
        });

        it('# recommendByUser Test', (done) => {
            mockUserDao.readByIdx = async () => {
                return {
                    gender: GENDER_WOMAN,
                    birth: 1995,
                };
            };
            mockLikePerfumeDao.readLikeInfo = async (
                userIdx,
                perfumeIdxList
            ) => {
                return [
                    { userIdx, perfumeIdx: 1 },
                    { userIdx, perfumeIdx: 2 },
                    { userIdx, perfumeIdx: 3 },
                    { userIdx, perfumeIdx: 4 },
                    { userIdx, perfumeIdx: 5 },
                ];
            };
            mockKeywordDao.readAllOfPerfumeIdxList = async (perfumeIdxList) => {
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
            const pagingRequestDTO = new PagingRequestDTO({
                pagingSize: 100,
                pagingIndex: 1,
                order: null,
            });
            Perfume.recommendByUser({ userIdx: 1, pagingRequestDTO })
                .then((result) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(
                        result,
                        PerfumeThumbKeywordDTO.validTest
                    );
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
                .catch((err) => done(err));
        });

        it('# getNewPerfume Test', (done) => {
            const pagingRequestDTO = new PagingRequestDTO({
                pagingSize: 100,
                pagingIndex: 1,
                order: null,
            });
            mockLikePerfumeDao.readLikeInfo = async (
                userIdx,
                perfumeIdxList
            ) => {
                return [{ userIdx, perfumeIdx: 2 }];
            };
            Perfume.getNewPerfume({ userIdx: 1, pagingRequestDTO })
                .then((result) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(
                        result,
                        PerfumeThumbDTO.validTest
                    );
                    done();
                })
                .catch((err) => done(err));
        });

        it('# getLikedPerfume Test', (done) => {
            const pagingRequestDTO = new PagingRequestDTO({
                pagingSize: 100,
                pagingIndex: 1,
                order: null,
            });
            mockLikePerfumeDao.readLikeInfo = async (
                userIdx,
                perfumeIdxList
            ) => {
                return perfumeIdxList.map((perfumeIdx) => ({
                    userIdx,
                    perfumeIdx,
                }));
            };
            Perfume.getLikedPerfume({ userIdx: 1, pagingRequestDTO })
                .then((result) => {
                    expect(result).to.be.instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(
                        result,
                        PerfumeThumbDTO.validTest
                    );
                    result.rows.forEach((item) => {
                        expect(item.isLiked).to.be.true;
                    });
                    done();
                })
                .catch((err) => done(err));
        });
    });
    describe('# like Test', () => {
        it('# likePerfume Test (좋아요)', (done) => {
            mockLikePerfumeDao.read = async (userIdx, perfumeIdx) => {
                throw new NotMatchedError();
            };
            mockLikePerfumeDao.delete = async (userIdx, perfumeIdx) => {
                return;
            };
            mockLikePerfumeDao.create = async (userIdx, perfumeIdx) => {
                return;
            };
            Perfume.likePerfume(1, 1)
                .then((result) => {
                    expect(result).to.be.true;
                    done();
                })
                .catch((err) => done(err));
        });

        it('# likePerfume Test (좋아요 취소)', (done) => {
            mockLikePerfumeDao.read = async (userIdx, perfumeIdx) => {
                return true;
            };
            mockLikePerfumeDao.delete = async (userIdx, perfumeIdx) => {
                return;
            };
            mockLikePerfumeDao.create = async (userIdx, perfumeIdx) => {
                return;
            };
            Perfume.likePerfume(1, 1)
                .then((result) => {
                    expect(result).to.be.false;
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
