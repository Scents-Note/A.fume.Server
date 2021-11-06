const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;

const ListAndCountDTO = require('../data/dto/ListAndCountDTO');
const SeriesDTO = require('../data/dto/SeriesDTO');

import IngredientMockHelper from '../data/dto/IngredientMockHelper';

const SeriesFilterDTO = require('../data/dto/SeriesFilterDTO');

const seriesService = require('../../src/service/SeriesService.js');
const mockSeriesDAO = {};
seriesService.setSeriesDao(mockSeriesDAO);
const mockIngredientDAO = {};
seriesService.setIngredientDao(mockIngredientDAO);

const mockNoteDAO = {};
seriesService.setNoteDao(mockNoteDAO);

describe('# Series Service Test', () => {
    describe('# getSeriesByIdx Test', () => {
        it('# success Test', (done) => {
            mockSeriesDAO.readByIdx = async () => SeriesDTO.createWithIdx(1);
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
            mockSeriesDAO.readAll = async () =>
                new ListAndCountDTO({
                    count: 3,
                    rows: [
                        SeriesDTO.createWithIdx(1),
                        SeriesDTO.createWithIdx(2),
                        SeriesDTO.createWithIdx(3),
                    ],
                });
            seriesService
                .getSeriesAll({})
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(result, SeriesDTO.validTest);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# searchSeries Test', () => {
        it('# success Test', (done) => {
            mockSeriesDAO.search = async () =>
                new ListAndCountDTO({
                    count: 3,
                    rows: [
                        SeriesDTO.createWithIdx(1),
                        SeriesDTO.createWithIdx(2),
                        SeriesDTO.createWithIdx(3),
                    ],
                });
            seriesService
                .searchSeries({})
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(result, SeriesDTO.validTest);
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
                        IngredientMockHelper.createWithIdx({
                            ingredientIdx: i,
                            seriesIdx: 1,
                        })
                    );
                for (let i = 6; i <= 7; i++)
                    ret.push(
                        IngredientMockHelper.createWithIdx({
                            ingredientIdx: i,
                            seriesIdx: 2,
                        })
                    );
                for (let i = 8; i <= 10; i++)
                    ret.push(
                        IngredientMockHelper.createWithIdx({
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
                    ListAndCountDTO.validTest.call(result, function () {
                        SeriesFilterDTO.validTest.call(this);
                        for (const ingredientDTO of this.ingredients) {
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
            mockSeriesDAO.findSeries = async () =>
                SeriesDTO.create({ name: 'test' });
            seriesService
                .findSeriesByEnglishName('test')
                .then((result) => {
                    expect(result).instanceOf(SeriesDTO);
                    SeriesDTO.validTest.call(result);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
