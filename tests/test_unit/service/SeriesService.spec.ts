import dotenv from 'dotenv';
import { Done } from 'mocha';
dotenv.config();

import {
    ListAndCountDTO,
    SeriesDTO,
    SeriesFilterDTO,
    IngredientDTO,
    IngredientCategoryDTO,
    PagingDTO,
} from '@dto/index';

import SeriesService from '@services/SeriesService';

import expect from '../utils/expect';

import IngredientMockHelper from '../mock_helper/IngredientMockHelper';
import SeriesHelper from '../mock_helper/SeriesMockHelper';
import { ETC } from '@src/utils/strings';

const mockSeriesDAO: any = {};
const mockIngredientDAO: any = {};
const mockIngredientCategoryDao: any = {};
const mockNoteDAO: any = {};
const seriesService = new SeriesService(
    mockSeriesDAO,
    mockIngredientDAO,
    mockIngredientCategoryDao,
    mockNoteDAO
);
const defaultPagingDTO: PagingDTO = PagingDTO.createByJson({});

describe('# Series Service Test', () => {
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
                .getSeriesAll(defaultPagingDTO)
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
                .searchSeries(defaultPagingDTO)
                .then((result: ListAndCountDTO<SeriesDTO>) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# getFilterSeries Test', () => {
        it('# success Test', (done: Done) => {
            mockIngredientDAO.readBySeriesIdxList = async (
                _: number[]
            ): Promise<IngredientDTO[]> => {
                const ret: any[] = [];
                for (let i = 1; i <= 5; i++)
                    ret.push(IngredientMockHelper.createWithIdx(i, 1));
                for (let i = 6; i <= 7; i++)
                    ret.push(IngredientMockHelper.createWithIdx(i, 2));
                for (let i = 8; i <= 10; i++)
                    ret.push(IngredientMockHelper.createWithIdx(i, 3));
                return ret;
            };
            mockIngredientCategoryDao.readAll = async () => {
                const ret: any[] = [];
                for (let i = 1; i <= 10; i++) {
                    ret.push(
                        IngredientCategoryDTO.createByJson({
                            idx: i,
                            name: '카테고리1',
                            usedCountOnPerfume: 10,
                        })
                    );
                }
                return ret;
            };

            seriesService
                .getFilterSeries(defaultPagingDTO)
                .then((result: ListAndCountDTO<SeriesFilterDTO>) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    expect(result.rows.length).to.be.eq(3);
                    expect(
                        result.rows.filter(
                            (it: SeriesFilterDTO) => it.name == ETC
                        ).length
                    ).to.be.eq(0);
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
