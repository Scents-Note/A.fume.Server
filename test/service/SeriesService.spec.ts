import dotenv from 'dotenv';
import { Done } from 'mocha';
dotenv.config();

import expect from '../utils/expect';
import ListAndCountDTO from '../../src/data/dto/ListAndCountDTO';
import IngredientMockHelper from '../data/dto/IngredientMockHelper';
import PagingRequestDTO from '../../src/data/request_dto/PagingRequestDTO';

import SeriesHelper from '../data/dto/SeriesMockHelper';
import SeriesDTO from '../../src/data/dto/SeriesDTO';
import IngredientDTO from '../../src/data/dto/IngredientDTO';
import SeriesFilterDTO from '../../src/data/dto/SeriesFilterDTO';

import SeriesService from '../../src/service/SeriesService';

const mockSeriesDAO: any = {};
const mockIngredientDAO: any = {};
const mockNoteDAO: any = {};
const seriesService = new SeriesService(
    mockSeriesDAO,
    mockIngredientDAO,
    mockNoteDAO
);

describe('# Series Service Test', () => {
    describe('# getSeriesByIdx Test', () => {
        it('# success Test', (done: Done) => {
            mockSeriesDAO.readByIdx = async (): Promise<SeriesDTO> =>
                SeriesHelper.createWithIdx(1);
            seriesService
                .getSeriesByIdx(1)
                .then((seriesDTO: SeriesDTO) => {
                    SeriesHelper.validTest.call(seriesDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# getSeriesAll Test', () => {
        it('# success Test', (done: Done) => {
            mockSeriesDAO.readAll = async (): Promise<
                ListAndCountDTO<SeriesDTO>
            > =>
                new ListAndCountDTO<SeriesDTO>(3, [
                    SeriesHelper.createWithIdx(1),
                    SeriesHelper.createWithIdx(2),
                    SeriesHelper.createWithIdx(3),
                ]);
            seriesService
                .getSeriesAll(PagingRequestDTO.createByJson({}))
                .then((result: ListAndCountDTO<SeriesDTO>) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# searchSeries Test', () => {
        it('# success Test', (done: Done) => {
            mockSeriesDAO.search = async () =>
                new ListAndCountDTO<SeriesDTO>(3, [
                    SeriesHelper.createWithIdx(1),
                    SeriesHelper.createWithIdx(2),
                    SeriesHelper.createWithIdx(3),
                ]);
            seriesService
                .searchSeries(PagingRequestDTO.createByJson({}))
                .then((result: ListAndCountDTO<SeriesDTO>) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# getFilterSeries Test', () => {
        it('# success Test', (done: Done) => {
            const isNoteCountOver10 = (ingredientIdx) => ingredientIdx % 2 == 1;
            mockIngredientDAO.readBySeriesIdxList = async (_: number[]) => {
                const ret = [];
                for (let i = 1; i <= 5; i++)
                    ret.push(IngredientMockHelper.createWithIdx(i, 1));
                for (let i = 6; i <= 7; i++)
                    ret.push(IngredientMockHelper.createWithIdx(i, 2));
                for (let i = 8; i <= 10; i++)
                    ret.push(IngredientMockHelper.createWithIdx(i, 3));
                return ret;
            };
            mockNoteDAO.countIngredientUsed = async (_: number[]) =>
                [...new Array(10)].map((_, index) => ({
                    ingredientIdx: index + 1,
                    count: isNoteCountOver10(index + 1) ? 100 : 4,
                }));

            seriesService
                .getFilterSeries(PagingRequestDTO.createByJson({}))
                .then((result: ListAndCountDTO<SeriesFilterDTO>) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    result.rows.forEach((seriesFilterDTO: SeriesFilterDTO) => {
                        seriesFilterDTO.ingredients.forEach(
                            (ingredientDTO: IngredientDTO) => {
                                expect(
                                    isNoteCountOver10(
                                        ingredientDTO.ingredientIdx
                                    )
                                ).to.be.eq(true);
                            }
                        );
                    });
                    expect(result.rows.length).to.be.eq(3);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# findSeriesByEnglishName Test', () => {
        it('# success Test', (done: Done) => {
            mockSeriesDAO.findSeries = async () =>
                SeriesHelper.create({ name: 'test' });
            seriesService
                .findSeriesByEnglishName('test')
                .then((result: SeriesDTO) => {
                    expect(result).instanceOf(SeriesDTO);
                    SeriesHelper.validTest.call(result);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
