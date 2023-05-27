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
    PerfumeInquireHistoryDTO,
    PagingDTO,
} from '@dto/index';

import BrandHelper from '../mock_helper/BrandHelper';
import PerfumeThumbMockHelper from '../mock_helper/PerfumeThumbMockHelper';
import _ from 'lodash';
const perfumeDao = new PerfumeDao();
const { Note, JoinPerfumeKeyword, Sequelize } = require('@sequelize');
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
                const categories: number[] = [1, 2, 3, 4, 5];
                const brands: number[] = [1, 2, 3, 4, 5];
                perfumeDao
                    .search(
                        brands,
                        ingredients,
                        categories,
                        [],
                        '',
                        PagingDTO.createByJson({
                            order: [['createdAt', 'asc']],
                        })
                    )
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.eq(5);
                        expect(result.rows.length).to.be.eq(5);
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
                            expect(ingredientByPerfumeIdxArr.length).to.be.eq(
                                ingredients.length
                            );
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
                    .search([], [], [], [], '', defaultPagingDTO)
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

            it('# success case (ingredient filter 1)', (done: Done) => {
                const ingredients: number[] = [1, 2, 3, 4, 5];
                const categories: number[] = [1, 2, 3, 4, 5];
                perfumeDao
                    .search(
                        [],
                        ingredients,
                        categories,
                        [],
                        '',
                        defaultPagingDTO
                    )
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.eq(5);
                        expect(result.rows.length).to.eq(5);
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
                            expect(ingredientByPerfumeIdxArr.length).to.be.eq(
                                ingredients.length
                            );
                            for (const ingredient of ingredientByPerfumeIdxArr) {
                                expect(ingredient.ingredientIdx).to.be.oneOf(
                                    ingredients
                                );
                            }
                        }
                        result.forEach((it: any) => {
                            expect(it.length).eq(ingredients.length);
                        });
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# success case (ingredient filter with no result)', (done: Done) => {
                const ingredients: number[] = [1, 2, 3, 4, 5, 6];
                const categories: number[] = [1, 2, 3, 4, 5, 6];
                perfumeDao
                    .search(
                        [],
                        ingredients,
                        categories,
                        [],
                        '',
                        defaultPagingDTO
                    )
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.eq(0);
                        expect(result.rows.length).to.eq(0);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# success case (brand filter)', (done: Done) => {
                const brands: number[] = [1, 2, 3, 4];
                perfumeDao
                    .search(brands, [], [], [], '', defaultPagingDTO)
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

            it('# success case (keyword filter 1)', (done: Done) => {
                const keywords: number[] = [1, 3, 5];
                perfumeDao
                    .search([], [], [], keywords, '', defaultPagingDTO)
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.eq(1);
                        expect(result.rows.length).to.eq(1);
                        return Promise.all(
                            result.rows.map((it: PerfumeSearchResultDTO) => {
                                return JoinPerfumeKeyword.findAll({
                                    where: {
                                        perfumeIdx: it.perfumeIdx,
                                        keywordIdx: {
                                            [Op.in]: keywords,
                                        },
                                    },
                                    raw: true,
                                    nest: true,
                                });
                            })
                        );
                    })
                    .then((result: any[]) => {
                        for (const keywordList of result) {
                            expect(keywordList.length).to.be.eq(
                                keywords.length
                            );
                            for (const keyword of keywordList) {
                                expect(keyword.keywordIdx).to.be.oneOf(
                                    keywords
                                );
                            }
                        }
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# success case (keyword filter with no result)', (done: Done) => {
                const keywords: number[] = [1, 2, 5];
                perfumeDao
                    .search([], [], [], keywords, '', defaultPagingDTO)
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.eq(0);
                        expect(result.rows.length).to.eq(0);
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
                    perfumeDao.search([], [], [], [], '', pagingDTO),
                    perfumeDao.search([], [], [], [], '', pagingDTO),
                    perfumeDao.search([], [], [], [], '', pagingDTO),
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

            it('# success case (searchText with perfume name)', (done: Done) => {
                perfumeDao
                    .search([], [], [], [], '향수', defaultPagingDTO)
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.eq(6);
                        expect(result.rows.length).to.be.eq(6);
                        result.rows.forEach(
                            (perfume: PerfumeSearchResultDTO) => {
                                expect(perfume.name).to.be.contains('향수');
                            }
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# success case (searchText with perfume english_name)', (done: Done) => {
                perfumeDao
                    .search([], [], [], [], 'perfume', defaultPagingDTO)
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.eq(6);
                        expect(result.rows.length).to.be.eq(6);
                        result.rows.forEach(
                            (perfume: PerfumeSearchResultDTO) => {
                                expect(perfume.englishName).to.be.contains(
                                    'perfume'
                                );
                            }
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# success case (searchText with brand name)', (done: Done) => {
                perfumeDao
                    .search([], [], [], [], '브랜드', defaultPagingDTO)
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.eq(6);
                        expect(result.rows.length).to.be.eq(6);
                        result.rows.forEach(
                            (perfume: PerfumeSearchResultDTO) => {
                                expect(perfume.Brand.name).to.be.contains(
                                    '브랜드'
                                );
                            }
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });

            it('# success case (searchText with brand english_name)', (done: Done) => {
                perfumeDao
                    .search([], [], [], [], 'brand', defaultPagingDTO)
                    .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                        expect(result.count).to.be.eq(6);
                        expect(result.rows.length).to.be.eq(6);
                        result.rows.forEach(
                            (perfume: PerfumeSearchResultDTO) => {
                                expect(
                                    perfume.Brand.englishName
                                ).to.be.contains('brand');
                            }
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# readPerfume Test', () => {
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
        });

        describe('# readLikedPerfume Test', () => {
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
        });
        describe('# recentSearchPerfumeList Test', () => {
            it('# recent search perfume List', (done) => {
                perfumeDao
                    .recentSearchPerfumeList(1, defaultPagingDTO)
                    .then(
                        (result: ListAndCountDTO<PerfumeInquireHistoryDTO>) => {
                            expect(result.rows.length).eq(5);
                            result.rows.forEach((element: any) => {
                                for (const key in element) {
                                    expect(element[key]).to.be.not.undefined;
                                }
                            });

                            const originString: string = result.rows
                                .map(
                                    (it: PerfumeInquireHistoryDTO) =>
                                        it.perfumeIdx
                                )
                                .toString();
                            const sortedString: string = result.rows
                                .sort(
                                    (
                                        a: PerfumeInquireHistoryDTO,
                                        b: PerfumeInquireHistoryDTO
                                    ) =>
                                        a.InquireHistory.createdAt >
                                        b.InquireHistory.createdAt
                                            ? -1
                                            : 1
                                )
                                .map(
                                    (it: PerfumeInquireHistoryDTO) =>
                                        it.perfumeIdx
                                )
                                .toString();
                            expect(sortedString).to.be.eq(originString);
                            for (const obj of result.rows) {
                                expect(obj.InquireHistory.userIdx).to.be.eq(1);
                            }
                            done();
                        }
                    )
                    .catch((err: Error) => done(err));
            });
        });

        describe('# readPerfumeSurvey Test', () => {
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

        describe('# recommend similar Test', () => {
            it('# update recommended similar perfumes ', async () => {
                const result: any = await perfumeDao.updateSimilarPerfumes({
                    1: [2, 3],
                    2: [3, 4, 5],
                });

                expect(result.length).to.be.eq(7);

                let err: any;
                let length: number;
                for (const response of result) {
                    err = response[0];
                    length = response[1];
                    expect(err).to.be.null;
                    expect(length).to.be.lte(3);
                }
            });

            it('# get recommended similar perfumes ', async () => {
                await perfumeDao.updateSimilarPerfumes({ 1: [1, 2, 3] });

                const result: number[] =
                    await perfumeDao.getSimilarPerfumeIdxList(1, 20);

                expect(result.length).to.be.eq(3);
            });
        });

        describe('# random Test', () => {
            it('# get perfumes by random', (done: Done) => {
                Promise.all([
                    perfumeDao.getPerfumesByRandom(defaultPagingDTO.limit),
                    perfumeDao.getPerfumesByRandom(defaultPagingDTO.limit),
                ])
                    .then((result: [PerfumeThumbDTO[], PerfumeThumbDTO[]]) => {
                        const result1: PerfumeThumbDTO[] = result[0];
                        const result2: PerfumeThumbDTO[] = result[1];
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

        describe('# getPerfumesByIdxList test', () => {
            it('# success case', (done: Done) => {
                const idxList: number[] = [5, 2, 3, 4, 1];
                perfumeDao
                    .getPerfumesByIdxList(idxList)
                    .then((result: PerfumeThumbDTO[]) => {
                        _.zip(idxList, result).map(
                            (
                                it: [
                                    number | undefined,
                                    PerfumeThumbDTO | undefined
                                ]
                            ) => {
                                const [idx, perfumeThumbDTO] = it;
                                expect(idx).to.be.not.undefined;
                                expect(perfumeThumbDTO).to.be.not.undefined;
                                expect(perfumeThumbDTO!!.perfumeIdx).to.be.eq(
                                    idx
                                );
                            }
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
    });
});
