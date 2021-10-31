const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;

const perfumeDao = require('../../src/dao/PerfumeDao.js');
const { Perfume, Note, Sequelize } = require('../../src/models');
const { Op } = Sequelize;

const { GENDER_WOMAN } = require('../../src/utils/constantUtil');
const {
    NotMatchedError,
    DuplicatedEntryError,
    UnExpectedError,
} = require('../../src/utils/errors/errors.js');

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
                        expect(result.story).to.be.eq('스토리1');
                        expect(result.abundanceRate).to.be.eq(1);
                        expect(result.volumeAndPrice).to.deep.eq([
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
    });
});
