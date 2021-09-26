const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const Perfume = require('../../service/PerfumeService.js');
const PerfumeIntegralDTO = require('../data/dto/PerfumeIntegralDTO');
const PerfumeThumbDTO = require('../data/dto/PerfumeThumbDTO');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO');
const {
    PagingRequestDTO,
    PerfumeSearchRequestDTO,
} = require('../../data/request_dto');
const { NotMatchedError } = require('../../utils/errors/errors.js');
const { GENDER_WOMAN } = require('../../utils/constantUtil.js');

const mockS3FileDao = {};
Perfume.setS3FileDao(mockS3FileDao);

const mockLikePerfumeDao = {};
Perfume.setLikePerfumeDao(mockLikePerfumeDao);

const mockUserDao = {};
Perfume.setUserDao(mockUserDao);

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
            Perfume.getPerfumeById(1, 1)
                .then((it) => {
                    PerfumeIntegralDTO.validTest.call(it);
                    expect(it.imageUrls).to.be.deep.eq([
                        'imageUrl1',
                        'imageUrl2',
                    ]);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# search Test', (done) => {
            mockLikePerfumeDao.readLikeInfo = async (userIdx, perfumeIdx) => {
                return [{ userIdx: 1, perfumeIdx: 2 }];
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
