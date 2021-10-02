const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;

const CreatedResultDTO = require('../data/dto/CreatedResultDTO');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO');
const SeriesDTO = require('../data/dto/SeriesDTO');
const IngredientDTO = require('../data/dto/IngredientDTO');
const SeriesFilterVO = require('../data/vo/SeriesFilterVO');

const seriesService = require('../../service/SeriesService');
seriesService.setSeriesDao(require('../dao/SeriesDao.mock.js'));
const mockIngredientDAO = {};
seriesService.setIngredientDao(mockIngredientDAO);

const mockNoteDAO = {};
seriesService.setNoteDao(mockNoteDAO);

describe('# Brand Service Test', () => {
    describe('# postSeries Test', () => {
        it('# success Test', (done) => {
            seriesService
                .postSeries(SeriesDTO.createWithIdx(1))
                .then((res) => {
                    expect(res).instanceOf(CreatedResultDTO);
                    res.validTest((created) => {
                        expect(created).instanceOf(SeriesDTO);
                        SeriesDTO.validTest.call(created);
                    });
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getSeriesByIdx Test', () => {
        it('# success Test', (done) => {
            seriesService
                .getSeriesByIdx(1)
                .then((seriesDTO) => {
                    SeriesDTO.validTest.call(seriesDTO);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getSeriesAll Test', () => {
        it('# success Test', (done) => {
            seriesService
                .getSeriesAll({})
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    result.validTest((item) => {
                        expect(item).instanceOf(SeriesDTO);
                        SeriesDTO.validTest.call(item);
                    });
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# searchSeries Test', () => {
        it('# success Test', (done) => {
            seriesService
                .searchSeries({})
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    result.validTest((item) => {
                        expect(item).instanceOf(SeriesDTO);
                        SeriesDTO.validTest.call(item);
                    });
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# putSeries Test', () => {
        it('# success Test', (done) => {
            seriesService
                .putSeries(SeriesDTO.createWithIdx(1))
                .then((affectedRow) => {
                    expect(affectedRow).to.be.eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# deleteSeries Test', () => {
        it('# success Test', (done) => {
            seriesService
                .deleteSeries(1)
                .then(() => {
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getFilterSeries Test', () => {
        it('# success Test', (done) => {
            const isNoteCountOver10 = (ingredientIdx) => ingredientIdx % 2 == 1;
            mockIngredientDAO.readBySeriesIdxList = async (seriesIdxList) => {
                const ret = [];
                for (let i = 1; i <= 5; i++)
                    ret.push(
                        IngredientDTO.createWithIdx({
                            ingredientIdx: i,
                            seriesIdx: 1,
                        })
                    );
                for (let i = 6; i <= 7; i++)
                    ret.push(
                        IngredientDTO.createWithIdx({
                            ingredientIdx: i,
                            seriesIdx: 2,
                        })
                    );
                for (let i = 8; i <= 10; i++)
                    ret.push(
                        IngredientDTO.createWithIdx({
                            ingredientIdx: i,
                            seriesIdx: 3,
                        })
                    );
                return ret;
            };
            mockNoteDAO.countIngredientUsed = async (ingredientIdxList) =>
                [...new Array(10)].map((it, index) => ({
                    ingredientIdx: index + 1,
                    count: isNoteCountOver10(index + 1) ? 100 : 4,
                }));

            seriesService
                .getFilterSeries({})
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    result.validTest((item) => {
                        expect(item).instanceOf(SeriesFilterVO);
                        SeriesFilterVO.validTest.call(item);
                        for (const ingredientDTO of item.ingredients) {
                            expect(
                                isNoteCountOver10(ingredientDTO.ingredientIdx)
                            ).to.be.eq(true);
                        }
                    });
                    expect(result.rows.length).to.be.eq(3);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# findSeriesByEnglishName Test', () => {
        it('# success Test', (done) => {
            seriesService
                .findSeriesByEnglishName('')
                .then((result) => {
                    expect(result).instanceOf(SeriesDTO);
                    SeriesDTO.validTest.call(result);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
