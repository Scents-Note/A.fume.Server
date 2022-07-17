import dotenv from 'dotenv';
dotenv.config();

import { expect } from 'chai';
import { Done } from 'mocha';

import { GENDER_WOMAN } from '@utils/constants';

import PerfumeDao from '@dao/PerfumeDao';

import {
    PerfumeDTO,
    ListAndCountDTO,
    PerfumeThumbDTO,
    PerfumeSearchResultDTO,
    PerfumeSearchHistoryDTO,
    PagingDTO,
} from '@dto/index';

import BrandHelper from '../mock_helper/BrandHelper';
import PerfumeThumbMockHelper from '../mock_helper/PerfumeThumbMockHelper';
import _ from 'lodash';
const perfumeDao = new PerfumeDao();
const { Note, Sequelize } = require('@sequelize');
const { Op } = Sequelize;
const defaultPagingDTO: PagingDTO = PagingDTO.createByJson({});

describe('# perfumeDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# read Test', () => {
        describe('# read by perfume_idx Test', () => {
            it('# success case', (done: Done) => {
                perfumeDao
                    .readByPerfumeIdx(1)
                    .then((result: PerfumeDTO) => {
                        expect(result.perfumeIdx).to.be.eq(1);
                        expect(result.name).to.be.eq('향수1');
                        expect(result.imageUrl).to.be.ok;
                        BrandHelper.validTest.call(result.Brand);
                        expect(result.Brand.name).to.be.eq('브랜드1');
                        expect(result.story).to.be.eq('스토리1');
                        expect(result.abundanceRate).to.be.eq(1);
                        expect(result.volumeAndPrice).to.deep.eq([
                            { volume: 30, price: 95000 },
                            { volume: 100, price: 190000 },
                        ]);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# search Test', () => {
            it('# success case (integral and brand filter)', (done: Done) => {
                const ingredients: number[] = [1, 2, 3, 4, 5];
                const brands: number[] = [1, 2, 3, 4, 5];
                perfumeDao
                    .search(
                        brands,
                        ingredients,
                        [],
                        '',
                        PagingDTO.createByJson({
                            order: [['createdAt', 'asc']],
                        })
                    )
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.eq(5);
                        expect(result.rows.length).to.be.gte(5);
                        result.rows.forEach(
                            (perfume: PerfumeSearchResultDTO) => {
                                expect(perfume.perfumeIdx).to.be.ok;
                                expect(perfume.brandName).to.be.ok;
                                expect(perfume.name).to.be.ok;
                                expect(perfume.imageUrl).to.be.ok;
                                expect(perfume.createdAt).to.be.not.undefined;
                                expect(perfume.updatedAt).to.be.not.undefined;

                                expect(perfume.Brand.brandIdx).to.be.oneOf(
                                    brands
                                );

                                BrandHelper.validTest.call(perfume.Brand);

                                expect(perfume.Score.keyword).to.be.gte(0);
                                expect(perfume.Score.ingredient).to.be.gte(0);
                                expect(perfume.Score.total).to.be.gte(0);
                            }
                        );

                        const sortedByDao: string = result.rows
                            .map((it: PerfumeSearchResultDTO) =>
                                it.createdAt.getTime()
                            )
                            .join(',');
                        const sortedByJS: string = result.rows
                            .map((it: PerfumeSearchResultDTO) =>
                                it.createdAt.getTime()
                            )
                            .sort()
                            .reverse()
                            .join(',');
                        expect(sortedByJS).eq(sortedByDao);

                        return Promise.all(
                            result.rows.map((it: PerfumeSearchResultDTO) => {
                                return Note.findAll({
                                    where: {
                                        perfumeIdx: it.perfumeIdx,
                                        ingredientIdx: {
                                            [Op.in]: ingredients,
                                        },
                                    },
                                    nest: true,
                                    raw: true,
                                });
                            })
                        );
                    })
                    .then((result: any[]) => {
                        for (const ingredientByPerfumeIdxArr of result) {
                            for (const ingredient of ingredientByPerfumeIdxArr) {
                                expect(ingredient.ingredientIdx).to.be.oneOf(
                                    ingredients
                                );
                            }
                        }
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
            it('# success case (empty filter)', (done: Done) => {
                perfumeDao
                    .search([], [], [], '', defaultPagingDTO)
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.gt(3);
                        expect(result.rows.length).to.be.gt(3);
                        result.rows.forEach(
                            (perfume: PerfumeSearchResultDTO) => {
                                expect(perfume.perfumeIdx).to.be.ok;
                                expect(perfume.brandIdx).to.be.ok;
                                expect(perfume.name).to.be.ok;
                                expect(perfume.imageUrl).to.be.ok;
                                expect(perfume.createdAt).to.be.not.undefined;
                                expect(perfume.updatedAt).to.be.not.undefined;

                                BrandHelper.validTest.call(perfume.Brand);
                            }
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# success case (ingredient filter)', (done: Done) => {
                const ingredients: number[] = [1, 2, 3, 4, 5];
                perfumeDao
                    .search([], ingredients, [], '', defaultPagingDTO)
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.gte(3);
                        expect(result.rows.length).to.gte(3);
                        return Promise.all(
                            result.rows.map((it: PerfumeSearchResultDTO) => {
                                return Note.findAll({
                                    where: {
                                        perfumeIdx: it.perfumeIdx,
                                        ingredientIdx: {
                                            [Op.in]: ingredients,
                                        },
                                    },
                                    raw: true,
                                    nest: true,
                                });
                            })
                        );
                    })
                    .then((result: any[]) => {
                        for (const ingredientByPerfumeIdxArr of result) {
                            for (const ingredient of ingredientByPerfumeIdxArr) {
                                expect(ingredient.ingredientIdx).to.be.oneOf(
                                    ingredients
                                );
                            }
                        }
                        result.forEach((it: any) => {
                            expect(it.length).gte(ingredients.length);
                        });
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# success case (brand filter)', (done: Done) => {
                const brands: number[] = [1, 2, 3, 4];
                perfumeDao
                    .search(brands, [], [], '', defaultPagingDTO)
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.gte(2);
                        expect(result.rows.length).to.gte(2);
                        result.rows.forEach(
                            (perfume: PerfumeSearchResultDTO) => {
                                expect(perfume.brandIdx).to.be.oneOf(brands);
                                expect(perfume.Brand.brandIdx).to.be.eq(
                                    perfume.brandIdx
                                );
                                BrandHelper.validTest.call(perfume.Brand);
                            }
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# success case (order by recent)', (done: Done) => {
                perfumeDao
                    .search(
                        [],
                        [],
                        [],
                        '',
                        PagingDTO.createByJson({
                            order: [['createdAt', 'desc']],
                        })
                    )
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.rows.length).gte(3);
                        const sortedByDao = result.rows
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        const sortedByJS: string = result.rows
                            .sort(
                                (
                                    a: PerfumeSearchResultDTO,
                                    b: PerfumeSearchResultDTO
                                ): number => {
                                    return a.createdAt.getTime() <
                                        b.createdAt.getTime()
                                        ? -1
                                        : 1;
                                }
                            )
                            .map((it: PerfumeSearchResultDTO) => it.perfumeIdx)
                            .join(',');
                        expect(sortedByDao).eq(sortedByJS);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# success case (order by random) ', (done: Done) => {
                const pagingDTO = PagingDTO.createByJson({
                    order: [Sequelize.fn('RAND')],
                });
                Promise.all([
                    perfumeDao.search([], [], [], '', pagingDTO),
                    perfumeDao.search([], [], [], '', pagingDTO),
                    perfumeDao.search([], [], [], '', pagingDTO),
                ])
                    .then(([result1, result2, result3]) => {
                        expect(result1.rows.length).gte(3);
                        expect(result2.rows.length).gte(3);
                        expect(result3.rows.length).gte(3);
                        const str1: string = result1.rows
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        const str2: string = result2.rows
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        const str3: string = result3.rows
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        expect(str1 == str2 && str1 == str3).eq(false);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
            it('# read new Perfume', (done: Done) => {
                perfumeDao
                    .readPerfume(undefined, defaultPagingDTO)
                    .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
                        expect(result.count).to.be.gte(1);
                        expect(result.rows.length).gte(1);
                        for (const perfume of result.rows) {
                            expect(perfume.createdAt).to.be.ok;
                            PerfumeThumbMockHelper.validTest.call(perfume);
                        }
                        const expectPerfumeIdxListStr: string = result.rows
                            .sort((it) => it.createdAt.getTime())
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        const actualPerfumeIdxListStr: string = result.rows
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        expect(actualPerfumeIdxListStr).to.be.eq(
                            expectPerfumeIdxListStr
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# read likedPerfume', (done: Done) => {
                perfumeDao
                    .readLikedPerfume(1, defaultPagingDTO)
                    .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
                        expect(result.count).to.be.gte(3);
                        expect(result.rows.length).to.be.gte(3);
                        for (const perfume of result.rows) {
                            PerfumeThumbMockHelper.validTest.call(perfume);
                        }
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('# recent search perfume List', (done) => {
                perfumeDao
                    .recentSearchPerfumeList(1, defaultPagingDTO)
                    .then(
                        (result: ListAndCountDTO<PerfumeSearchHistoryDTO>) => {
                            expect(result.rows.length).gte(5);
                            result.rows.forEach((element: any) => {
                                for (const key in element) {
                                    expect(element[key]).to.be.not.undefined;
                                }
                            });

                            const originString: string = result.rows
                                .map(
                                    (it: PerfumeSearchHistoryDTO) =>
                                        it.perfumeIdx
                                )
                                .toString();
                            const sortedString: string = result.rows
                                .sort(
                                    (
                                        a: PerfumeSearchHistoryDTO,
                                        b: PerfumeSearchHistoryDTO
                                    ) =>
                                        a.SearchHistory.createdAt >
                                        b.SearchHistory.createdAt
                                            ? -1
                                            : 1
                                )
                                .map(
                                    (it: PerfumeSearchHistoryDTO) =>
                                        it.perfumeIdx
                                )
                                .toString();
                            expect(sortedString).to.be.eq(originString);
                            for (const obj of result.rows) {
                                expect(obj.SearchHistory.userIdx).to.be.eq(1);
                            }
                            done();
                        }
                    )
                    .catch((err: Error) => done(err));
            });

            it('# read perfume survey', (done: Done) => {
                perfumeDao
                    .readPerfumeSurvey(GENDER_WOMAN)
                    .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
                        expect(result.count).to.be.gte(5);
                        expect(result.rows.length).to.be.gte(5);
                        for (const perfume of result.rows) {
                            PerfumeThumbMockHelper.validTest.call(perfume);
                        }
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
        describe('# recommend Test', () => {
            it('# recommend perfume by age and gender', (done: Done) => {
                perfumeDao
                    .recommendPerfumeByAgeAndGender(
                        GENDER_WOMAN,
                        20,
                        defaultPagingDTO
                    )
                    .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
                        expect(result.count).to.be.gte(3);
                        expect(result.rows.length).to.be.gte(3);
                        for (const perfume of result.rows) {
                            PerfumeThumbMockHelper.validTest.call(perfume);
                        }
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# random Test', () => {
            it('# get perfumes by random', (done: Done) => {
                Promise.all([
                    perfumeDao.getPerfumesByRandom(defaultPagingDTO),
                    perfumeDao.getPerfumesByRandom(defaultPagingDTO),
                ])
                    .then((result: [[PerfumeThumbDTO], [PerfumeThumbDTO]]) => {
                        const result1: [PerfumeThumbDTO] = result[0];
                        const result2: [PerfumeThumbDTO] = result[1];
                        expect(
                            _.zip(result1, result2).filter(
                                (
                                    it: [
                                        PerfumeThumbDTO | undefined,
                                        PerfumeThumbDTO | undefined
                                    ]
                                ) => _.isEqual(it[0], it[1])
                            ).length
                        ).to.be.lessThan(defaultPagingDTO.limit);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
    });
});
