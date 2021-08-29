const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;

const CreatedResultDTO = require('../data/dto/CreatedResultDTO');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO');
const SeriesDTO = require('../data/dto/SeriesDTO');
const IngredientDTO = require('../data/dto/IngredientDTO');
const SeriesFilterVO = require('../data/vo/SeriesFilterVO');

const mockSeriesDTO = new SeriesDTO({
    seriesIdx: 1,
    name: '계열1',
    englishName: 'SERIES1',
    imageUrl: 'http://',
    description: '이것은 계열',
    createdAt: '2021-07-24T03:38:52.000Z',
    updatedAt: '2021-07-24T03:38:52.000Z',
});

const mockIngredient = (ingredientIdx, seriesIdx) =>
    new IngredientDTO({
        ingredientIdx: ingredientIdx,
        name: '재료' + ingredientIdx,
        englishName: 'Ingredient ' + ingredientIdx,
        seriesIdx: seriesIdx,
        imageUrl: 'http://',
        description: '이것은 재료',
        createdAt: '2021-07-24T03:38:52.000Z',
        updatedAt: '2021-07-24T03:38:52.000Z',
    });

const seriesService = require('../../service/SeriesService');
seriesService.setSeriesDao(require('../dao/SeriesDao.mock.js'));
const mockIngredientDAO = require('../dao/IngredientDao.mock');
seriesService.setIngredientDao(mockIngredientDAO);

const mockNoteDAO = {};
seriesService.setNoteDao(mockNoteDAO);

describe('# Brand Service Test', () => {
    describe('# postSeries Test', () => {
        it('# success Test', (done) => {
            seriesService
                .postSeries(mockSeriesDTO)
                .then((res) => {
                    expect(res).instanceOf(CreatedResultDTO);
                    res.validTest((created) => {
                        expect(created).instanceOf(SeriesDTO);
                        created.validTest();
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
                    seriesDTO.validTest();
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
                        item.validTest();
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
                        item.validTest();
                    });
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# putSeries Test', () => {
        it('# success Test', (done) => {
            seriesService
                .putSeries(mockSeriesDTO)
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
                for (let i = 1; i <= 5; i++) ret.push(mockIngredient(i, 1));
                for (let i = 6; i <= 7; i++) ret.push(mockIngredient(i, 2));
                for (let i = 8; i <= 10; i++) ret.push(mockIngredient(i, 3));
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
                        item.validTest();
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
                    result.validTest();
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
