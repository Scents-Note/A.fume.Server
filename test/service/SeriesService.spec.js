import dotenv from 'dotenv';
import { expect } from 'chai';
dotenv.config();

import ListAndCountDTO from '../../src/data/dto/ListAndCountDTO';
import IngredientMockHelper from '../data/dto/IngredientMockHelper';

import SeriesHelper from '../data/dto/SeriesMockHelper';
import SeriesFilterDTO from '../data/dto/SeriesFilterDTO';
import SeriesDTO from '../../src/data/dto/SeriesDTO';

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
            mockSeriesDAO.readByIdx = async () => SeriesHelper.createWithIdx(1);
            seriesService
                .getSeriesByIdx(1)
                .then((seriesDTO) => {
                    SeriesHelper.validTest.call(seriesDTO);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getSeriesAll Test', () => {
        it('# success Test', (done) => {
            mockSeriesDAO.readAll = async () =>
                /* TODO */
                // new ListAndCountDTO<SeriesDTO>(3, [
                new ListAndCountDTO(3, [
                    SeriesHelper.createWithIdx(1),
                    SeriesHelper.createWithIdx(2),
                    SeriesHelper.createWithIdx(3),
                ]);
            seriesService
                .getSeriesAll({})
                /* TODO */
                // .then((result: ListAndCountDTO<SeriesDTO>) => {
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# searchSeries Test', () => {
        it('# success Test', (done) => {
            mockSeriesDAO.search = async () =>
                /* TODO */
                // new ListAndCountDTO<SeriesDTO>(3, [
                new ListAndCountDTO(3, [
                    SeriesHelper.createWithIdx(1),
                    SeriesHelper.createWithIdx(2),
                    SeriesHelper.createWithIdx(3),
                ]);
            seriesService
                .searchSeries({})
                /* TODO */
                // .then((result: ListAndCountDTO<SeriesDTO>) => {
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
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
                    ret.push(IngredientMockHelper.createWithIdx(i, 1));
                for (let i = 6; i <= 7; i++)
                    ret.push(IngredientMockHelper.createWithIdx(i, 2));
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
                /* TODO */
                // .then((result: ListAndCountDTO<SeriesFilterDTO>) => {
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    for (const seriesFilterDTO of result.rows) {
                        for (const ingredientDTO of seriesFilterDTO.ingredients) {
                            expect(
                                isNoteCountOver10(ingredientDTO.ingredientIdx)
                            ).to.be.eq(true);
                        }
                    }
                    expect(result.rows.length).to.be.eq(3);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# findSeriesByEnglishName Test', () => {
        it('# success Test', (done) => {
            mockSeriesDAO.findSeries = async () =>
                SeriesHelper.create({ name: 'test' });
            seriesService
                .findSeriesByEnglishName('test')
                .then((result) => {
                    expect(result).instanceOf(SeriesDTO);
                    SeriesHelper.validTest.call(result);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
