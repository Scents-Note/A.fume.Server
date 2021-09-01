const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;

const perfumeDao = require('../../dao/PerfumeDao.js');
const { Perfume, PerfumeDetail, Note, Sequelize } = require('../../models');
const { Op } = Sequelize;

const { GENDER_WOMAN } = require('../../utils/constantUtil');
const {
    NotMatchedError,
    DuplicatedEntryError,
    UnExpectedError,
} = require('../../utils/errors/errors.js');

const allowFirstInitialArr = [
    'ㄱ',
    'ㄴ',
    'ㄷ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅅ',
    'ㅇ',
    'ㅈ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
    'ㄲ',
    'ㄸ',
    'ㅃ',
    'ㅆ',
    'ㅉ',
];
describe('# perfumeDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# create Test', () => {
        before(async () => {
            await Perfume.destroy({ where: { name: '삽입테스트' } });
        });
        it('# success case', (done) => {
            const perfumeObj = {
                name: '삽입테스트',
                brandIdx: 1,
                englishName: 'insert Test',
                volumeAndPrice: {},
                imageUrl: 'URL',
                story: '스토리',
                abundanceRate: 2,
            };
            perfumeDao
                .create(perfumeObj)
                .then((result) => {
                    return perfumeDao.readByPerfumeIdx(result);
                })
                .then((result) => {
                    expect(result.name).to.be.eq('삽입테스트');
                    expect(result.brandIdx).to.be.eq(1);
                    expect(result.englishName).to.be.eq('insert Test');
                    expect(result.imageUrl).to.be.eq('URL');
                    expect(result.PerfumeDetail.volumeAndPrice).to.deep.equal(
                        []
                    );
                    expect(result.PerfumeDetail.perfumeIdx).to.be.eq(
                        result.perfumeIdx
                    );
                    expect(result.PerfumeDetail.story).to.be.eq('스토리');
                    expect(result.PerfumeDetail.abundanceRate).to.be.eq(2);
                    expect(result.Brand.name).to.be.eq('브랜드1');
                    expect(result.Brand.englishName).to.be.ok;
                    expect(result.Brand.firstInitial).to.be.oneOf(
                        allowFirstInitialArr
                    );
                    expect(result.Brand.description).to.be.ok;
                    expect(result.Brand.brandIdx).to.be.eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
        it('# DuplicatedEntry Error case', (done) => {
            perfumeDao
                .create({
                    name: '삽입테스트',
                    brandIdx: 1,
                    englishName: 'insert Test',
                    volumeAndPrice: '',
                    imageUrl: 'URL',
                    story: '스토리',
                    abundanceRate: 2,
                })
                .then(() => {
                    throw new UnExpectedError(DuplicatedEntryError);
                })
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });
    });
    describe('# read Test', () => {
        describe('# read by perfume_idx Test', () => {
            it('# success case', (done) => {
                perfumeDao
                    .readByPerfumeIdx(1)
                    .then((result) => {
                        expect(result.perfumeIdx).to.be.eq(1);
                        expect(result.name).to.be.eq('향수1');
                        expect(result.englishName).to.be.ok;
                        expect(result.imageUrl).to.be.ok;

                        expect(result.Brand.brandIdx).to.be.eq(result.brandIdx);
                        expect(result.Brand.name).to.be.eq('브랜드1');
                        expect(result.Brand.englishName).to.be.ok;
                        expect(result.Brand.description).to.be.ok;
                        expect(result.Brand.imageUrl).to.be.ok;
                        expect(result.Brand.firstInitial).to.be.oneOf(
                            allowFirstInitialArr
                        );

                        expect(result.PerfumeDetail.perfumeIdx).to.be.eq(1);
                        expect(result.PerfumeDetail.story).to.be.eq('스토리1');
                        expect(result.PerfumeDetail.abundanceRate).to.be.eq(1);
                        expect(result.PerfumeDetail.volumeAndPrice).to.deep.eq([
                            { volume: 30, price: 95000 },
                            { volume: 100, price: 190000 },
                        ]);
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# search Test', () => {
            it('# success case (integral and brand filter)', (done) => {
                const ingredients = [1, 2, 3, 4, 5];
                const brands = [1, 2, 3, 4, 5];
                perfumeDao
                    .search(brands, ingredients, [], '', 1, 100, [
                        ['createdAt', 'asc'],
                    ])
                    .then((result) => {
                        expect(result.count).to.be.eq(5);
                        expect(result.rows.length).to.be.gte(5);
                        for (const perfume of result.rows) {
                            expect(perfume.perfumeIdx).to.be.ok;
                            expect(perfume.brandIdx).to.be.ok;
                            expect(perfume.name).to.be.ok;
                            expect(perfume.englishName).to.be.ok;
                            expect(perfume.imageUrl).to.be.ok;
                            expect(perfume.createdAt).to.be.not.undefined;
                            expect(perfume.updatedAt).to.be.not.undefined;

                            expect(perfume.Brand.brandIdx).to.be.oneOf(brands);
                            expect(perfume.Brand.name).to.be.ok;
                            expect(perfume.Brand.englishName).to.be.ok;
                            expect(perfume.Brand.description).to.be.ok;
                            expect(perfume.Brand.imageUrl).to.be.ok;
                            expect(perfume.Brand.firstInitial).to.be.oneOf(
                                allowFirstInitialArr
                            );

                            expect(perfume.Score.keyword).to.be.gte(0);
                            expect(perfume.Score.ingredient).to.be.gte(0);
                            expect(perfume.Score.total).to.be.gte(0);
                        }

                        const sortedByDao = result.rows
                            .map((it) => it.createdAt.getTime())
                            .join(',');
                        const sortedByJS = result.rows
                            .map((it) => it.createdAt.getTime())
                            .sort()
                            .reverse()
                            .join(',');
                        expect(sortedByJS).eq(sortedByDao);

                        return Promise.all(
                            result.rows.map((it) => {
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
                    .then((result) => {
                        for (const ingredientByPerfumeIdxArr of result) {
                            for (const ingredient of ingredientByPerfumeIdxArr) {
                                expect(ingredient.ingredientIdx).to.be.oneOf(
                                    ingredients
                                );
                            }
                        }
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('# success case (empty filter)', (done) => {
                perfumeDao
                    .search([], [], [], '', 1, 100)
                    .then((result) => {
                        expect(result.count).to.be.gt(3);
                        expect(result.rows.length).to.be.gt(3);
                        for (const perfume of result.rows) {
                            expect(perfume.perfumeIdx).to.be.ok;
                            expect(perfume.brandIdx).to.be.ok;
                            expect(perfume.name).to.be.ok;
                            expect(perfume.englishName).to.be.ok;
                            expect(perfume.imageUrl).to.be.ok;
                            expect(perfume.createdAt).to.be.not.undefined;
                            expect(perfume.updatedAt).to.be.not.undefined;

                            expect(perfume.Brand.brandIdx).to.be.ok;
                            expect(perfume.Brand.name).to.be.ok;
                            expect(perfume.Brand.englishName).to.be.ok;
                            expect(perfume.Brand.description).to.be.ok;
                            expect(perfume.Brand.imageUrl).to.be.ok;
                            expect(perfume.Brand.firstInitial).to.be.oneOf(
                                allowFirstInitialArr
                            );
                        }
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# success case (ingredient filter)', (done) => {
                const ingredients = [1, 2, 3, 4, 5];
                perfumeDao
                    .search([], ingredients, [], '', 1, 100)
                    .then((result) => {
                        expect(result.count).to.be.gte(3);
                        expect(result.rows.length).to.gte(3);
                        return Promise.all(
                            result.rows.map((it) => {
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
                    .then((result) => {
                        for (const ingredientByPerfumeIdxArr of result) {
                            for (const ingredient of ingredientByPerfumeIdxArr) {
                                expect(ingredient.ingredientIdx).to.be.oneOf(
                                    ingredients
                                );
                            }
                        }
                        result.forEach((it) => {
                            expect(it.length).gte(ingredients.length);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# success case (brand filter)', (done) => {
                const brands = [1, 2, 3, 4];
                perfumeDao
                    .search(brands, [], [], '', 1, 100)
                    .then((result) => {
                        expect(result.count).to.be.gte(2);
                        expect(result.rows.length).to.gte(2);
                        result.rows.forEach((perfume) => {
                            expect(perfume.brandIdx).to.be.oneOf(brands);
                            expect(perfume.Brand.brandIdx).to.be.eq(
                                perfume.brandIdx
                            );
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# success case (order by like) ', (done) => {
                perfumeDao
                    .search([], [], [], '', 1, 100, [['likeCnt', 'asc']])
                    .then((result) => {
                        expect(result.count).to.be.gte(3);
                        expect(result.rows.length).to.be.gte(3);
                        const sortedByDao = result.rows
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        const sortedByJS = result.rows
                            .sort((a, b) => {
                                return a.likeCnt - b.likeCnt;
                            })
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        expect(sortedByJS).eq(sortedByDao);
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# success case (order by recent)', (done) => {
                perfumeDao
                    .search([], [], [], '', 1, 100, [['createdAt', 'desc']])
                    .then((result) => {
                        expect(result.rows.length).gte(3);
                        const sortedByDao = result.rows
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        const sortedByJS = result.rows
                            .sort((a, b) => {
                                return (
                                    a.createdAt.getTime() <
                                    b.createdAt.getTime()
                                );
                            })
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        expect(sortedByDao).eq(sortedByJS);
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# success case (order by random) ', (done) => {
                Promise.all([
                    perfumeDao.search([], [], [], '', 1, 100, [
                        Sequelize.fn('RAND'),
                    ]),
                    perfumeDao.search([], [], [], '', 1, 100, [
                        Sequelize.fn('RAND'),
                    ]),
                    perfumeDao.search([], [], [], '', 1, 100, [
                        Sequelize.fn('RAND'),
                    ]),
                ])
                    .then(([result1, result2, result3]) => {
                        expect(result1.rows.length).gte(3);
                        expect(result2.rows.length).gte(3);
                        expect(result3.rows.length).gte(3);
                        const str1 = result1.rows
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        const str2 = result2.rows
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        const str3 = result3.rows
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        expect(str1 == str2 && str1 == str3).eq(false);
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('# read new Perfume', (done) => {
                const fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - 7);
                perfumeDao
                    .readNewPerfume(fromDate, 1, 100)
                    .then((result) => {
                        expect(result.count).to.be.gte(1);
                        expect(result.rows.length).gte(1);
                        for (const perfume of result.rows) {
                            expect(perfume.createdAt).to.be.ok;
                            expect(perfume.createdAt.getTime()).to.be.gte(
                                fromDate.getTime()
                            );
                        }
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# read likedPerfume', (done) => {
                perfumeDao
                    .readLikedPerfume(1, 1, 100)
                    .then((result) => {
                        expect(result.count).to.be.gte(3);
                        expect(result.rows.length).to.be.gte(3);
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('# recent search perfume List', (done) => {
                perfumeDao
                    .recentSearchPerfumeList(1, 1, 100)
                    .then((result) => {
                        expect(result.rows.length).gte(5);
                        const originString = result.rows
                            .map((it) => it.perfumeIdx)
                            .toString();
                        const sortedString = result.rows
                            .sort(
                                (a, b) =>
                                    a.SearchHistory.createdAt >
                                    b.SearchHistory.createdAt
                            )
                            .map((it) => it.perfumeIdx)
                            .toString();
                        expect(sortedString).to.be.eq(originString);
                        for (const obj of result.rows) {
                            expect(obj.SearchHistory.userIdx).to.be.eq(1);
                        }
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# read perfume survey', (done) => {
                perfumeDao
                    .readPerfumeSurvey(GENDER_WOMAN)
                    .then((result) => {
                        expect(result.count).to.be.gte(5);
                        expect(result.rows.length).to.be.gte(5);
                        for (const perfume of result.rows) {
                            expect(perfume.perfumeIdx).to.be.ok;
                            expect(perfume.brandIdx).to.be.ok;
                            expect(perfume.name).to.be.ok;
                            expect(perfume.englishName).to.be.ok;
                            expect(perfume.imageUrl).to.be.ok;
                            expect(perfume.createdAt).to.be.not.undefined;
                            expect(perfume.updatedAt).to.be.not.undefined;

                            expect(perfume.Brand.brandIdx).to.be.ok;
                            expect(perfume.Brand.name).to.be.ok;
                            expect(perfume.Brand.englishName).to.be.ok;
                            expect(perfume.Brand.description).to.be.ok;
                            expect(perfume.Brand.imageUrl).to.be.ok;
                            expect(perfume.Brand.firstInitial).to.be.oneOf(
                                allowFirstInitialArr
                            );
                        }
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
        describe('# recommend Test', () => {
            it('# recommend perfume by age and gender', (done) => {
                perfumeDao
                    .recommendPerfumeByAgeAndGender(GENDER_WOMAN, 20, 1, 100)
                    .then((result) => {
                        expect(result.count).to.be.gte(3);
                        expect(result.rows.length).to.be.gte(3);
                        for (const perfume of result.rows) {
                            expect(perfume.perfumeIdx).to.be.ok;
                            expect(perfume.brandIdx).to.be.ok;
                            expect(perfume.name).to.be.ok;
                            expect(perfume.englishName).to.be.ok;
                            expect(perfume.imageUrl).to.be.ok;
                            expect(perfume.createdAt).to.be.not.undefined;
                            expect(perfume.updatedAt).to.be.not.undefined;

                            expect(perfume.Brand.brandIdx).to.be.ok;
                            expect(perfume.Brand.name).to.be.ok;
                            expect(perfume.Brand.englishName).to.be.ok;
                            expect(perfume.Brand.description).to.be.ok;
                            expect(perfume.Brand.imageUrl).to.be.ok;
                            expect(perfume.Brand.firstInitial).to.be.oneOf(
                                allowFirstInitialArr
                            );
                        }
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
        describe('# find Test', () => {
            it('# findPerfumeIdx success case', (done) => {
                perfumeDao
                    .findPerfumeIdx({
                        englishName: 'perfume-1',
                    })
                    .then((result) => {
                        expect(result).eq(1);
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('# findPerfumeIdx not found case', (done) => {
                perfumeDao
                    .findPerfumeIdx({
                        englishName: 'perfume-10',
                    })
                    .then(() => {
                        throw new UnExpectedError(NotMatchedError);
                    })
                    .catch((err) => {
                        expect(err).instanceOf(NotMatchedError);
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });

    describe('# update Test', () => {
        let perfumeIdx;
        before(async () => {
            const previousPerfume = await Perfume.findOne({
                where: { name: '수정 테스트' },
                raw: true,
                nest: true,
            });
            previousPerfume &&
                (await Promise.all(
                    Perfume.destroy({ where: { name: '수정 테스트' } }),
                    PerfumeDetail.destroy({ where: previousPerfume.perfumeIdx })
                ));
            const { dataValues } = await Perfume.create({
                brandIdx: 1,
                name: '수정 테스트',
                englishName: 'perfume_delete_test',
                imageUrl: 'URL',
            });
            perfumeIdx = dataValues.perfumeIdx;
            await PerfumeDetail.create({
                perfumeIdx: perfumeIdx,
                story: '향수 수정 스토리',
                abundanceRate: 2,
                volumeAndPrice: '',
            });
        });
        it('# success case', (done) => {
            const perfumeObj = {
                perfumeIdx,
                name: '수정된 이름',
                brandIdx: 2,
                englishName: '수정된 영어이름',
                volumeAndPrice: '',
                imageUrl: '수정된url',
                story: '수정된스토리',
                abundanceRate: 2,
            };
            perfumeDao
                .update(perfumeObj)
                .then((result) => {
                    expect(result.filter((it) => it == 1)).to.lengthOf(2);
                    return perfumeDao.readByPerfumeIdx(perfumeIdx);
                })
                .then((result) => {
                    expect(result.perfumeIdx).to.be.eq(perfumeIdx);
                    expect(result.name).to.be.eq('수정된 이름');
                    expect(result.brandIdx).to.be.eq(2);
                    expect(result.englishName).to.be.eq('수정된 영어이름');
                    expect(result.imageUrl).to.be.eq('수정된url');
                    expect(result.PerfumeDetail.perfumeIdx).to.be.eq(
                        perfumeIdx
                    );
                    expect(result.PerfumeDetail.story).to.be.eq('수정된스토리');
                    expect(result.PerfumeDetail.abundanceRate).to.be.eq(2);
                    expect(result.PerfumeDetail.volumeAndPrice).to.be.deep.eq(
                        []
                    );
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            if (!perfumeIdx) return;
            await Promise.all([
                Perfume.destroy({ where: { perfumeIdx } }),
                PerfumeDetail.destroy({ where: { perfumeIdx } }),
            ]);
        });
    });
    describe('# delete Test', () => {
        let perfumeIdx;
        before(async () => {
            const { dataValues: perfume } = await Perfume.create({
                brandIdx: 1,
                name: '향수 삭제 테스트',
                englishName: 'perfume_delete_test',
                imageUrl: 'URL',
            });
            perfumeIdx = perfume.perfumeIdx;
            await PerfumeDetail.create({
                perfumeIdx,
                story: '향수 삭제 테스트 용',
                abundanceRate: 2,
                volumeAndPrice: '',
            });
        });

        it('# success case', (done) => {
            perfumeDao
                .delete(perfumeIdx)
                .then((result) => {
                    expect(result).eq(1);
                    return PerfumeDetail.findOne({
                        where: { perfumeIdx: perfumeIdx },
                    });
                })
                .then((it) => done())
                .catch((err) => done(err));
        });
        after(() => {
            Perfume.destroy({ perfumeIdx });
            PerfumeDetail.destroy({ perfumeIdx });
        });
    });
});
