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
    PerfumeInquireHistoryDTO,
    PagingDTO,
} from '@dto/index';

import BrandHelper from '../mock_helper/BrandHelper';
import PerfumeThumbMockHelper from '../mock_helper/PerfumeThumbMockHelper';
import _ from 'lodash';
const perfumeDao = new PerfumeDao();

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
            it('# read likedPerfume', () => {
                perfumeDao
                    .readLikedPerfume(1, defaultPagingDTO)
                    .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
                        expect(result.count).to.be.gte(3);
                        expect(result.rows.length).to.be.gte(3);
                        for (const perfume of result.rows) {
                            PerfumeThumbMockHelper.validTest.call(perfume);
                        }
                    });
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
