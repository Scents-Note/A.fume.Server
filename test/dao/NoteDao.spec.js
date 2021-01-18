const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const noteDao = require('../../dao/NoteDao.js');
const { DuplicatedEntryError } = require('../../utils/errors/errors.js');
const {
    sequelize,
    Note,
    Ingredient,
    Brand,
    Series,
    Perfume,
    PerfumeDetail,
} = require('../../models');

describe('# NoteDao Test', () => {
    before(async () => {
        sequelize.sync();
        await Ingredient.upsert({
            ingredientIdx: 1,
            name: '테스트 데이터1',
            englishName: 'Test Data',
            description: '왈라왈라',
            imageUrl: '',
        });
        await Ingredient.upsert({
            ingredientIdx: 2,
            name: '테스트 데이터2',
            englishName: 'Test Data',
            description: '왈라왈라',
            imageUrl: '',
        });
        await Ingredient.upsert({
            ingredientIdx: 3,
            name: '테스트 데이터3',
            englishName: 'Test Data',
            description: '왈라왈라',
            imageUrl: '',
        });
        await Ingredient.upsert({
            ingredientIdx: 4,
            name: '테스트 데이터4',
            englishName: 'Test Data',
            description: '왈라왈라',
            imageUrl: '',
        });
        await Ingredient.upsert({
            ingredientIdx: 5,
            name: '테스트 데이터5',
            englishName: 'Test Data',
            description: '왈라왈라',
            imageUrl: '',
        });
        await Brand.upsert({
            brandIdx: 1,
            name: '조 말론 런던',
            startCharacter: 'ㅈ',
            englishName: 'Jo Malone London',
            imageUrl: '',
            description: '브랜드',
        });
        await Series.upsert({
            seriesIdx: 1,
            name: '플로럴',
            englishName: 'Floral',
            description: '',
        });
        await Perfume.upsert({
            perfumeIdx: 1,
            brandIdx: 1,
            mainSeriesIdx: 1,
            name: '오토니엘 로사 오 드 뚜왈렛',
            englishName: 'OTHONIEL ROSA EAU DE TOILETTE',
            imageThumbnailUrl: '',
            releaseDate: '2020-12-30',
        });
        await PerfumeDetail.upsert({
            perfumeIdx: 1,
            story: '스토리',
            abundanceRate: 1,
            imageUrl: '',
            volumeAndPrice: '{"30":"95000","100":"190000"}',
        });
        await Note.upsert({
            ingredientIdx: 2,
            perfumeIdx: 1,
            type: 1,
        });
        await Note.upsert({
            ingredientIdx: 3,
            perfumeIdx: 1,
            type: 2,
        });
        await Note.upsert({
            ingredientIdx: 4,
            perfumeIdx: 1,
            type: 2,
        });
        await Note.upsert({
            ingredientIdx: 5,
            perfumeIdx: 1,
            type: 3,
        });
    });
    describe(' # create Test', () => {
        before(async () => {
            await Note.destroy({ where: { ingredientIdx: 1, perfumeIdx: 1 } });
        });
        it(' # success case', (done) => {
            noteDao
                .create({ ingredientIdx: 1, perfumeIdx: 1, type: 1 })
                .then((result) => {
                    expect(result).to.not.be.null;
                    done();
                })
                .catch((err) => done(err));
        });
        it(' # DuplicatedEntryError case', (done) => {
            noteDao
                .create({ ingredientIdx: 1, perfumeIdx: 1, type: 1 })
                .then((result) =>
                    done(new Error('must be expected DuplicatedEntryError'))
                )
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Note.destroy({ where: { ingredientIdx: 1, perfumeIdx: 1 } });
        });
    });

    describe(' # read Test', () => {
        it('# success case', (done) => {
            noteDao
                .read(1)
                .then((result) => {
                    expect(result.length).gte(4);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe(' # update Test', () => {
        before(async () => {
            await Note.upsert({
                ingredientIdx: 1,
                perfumeIdx: 1,
                type: 1,
            });
        });
        it('# note type update success case', (done) => {
            noteDao
                .updateType({ type: 5, perfumeIdx: 1, ingredientIdx: 1 })
                .then((result) => {
                    expect(result).eq(1);
                    return Note.findOne({
                        where: { ingredientIdx: 1, perfumeIdx: 1 },
                    });
                })
                .then((result) => {
                    expect(result.type).to.eq(5);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe(' # delete Test', () => {
        before(async () => {
            await Note.upsert({
                ingredientIdx: 1,
                perfumeIdx: 1,
                type: 1,
            });
        });
        it('# success case', (done) => {
            noteDao
                .delete(1, 1)
                .then((result) => {
                    expect(result).eq(1);
                    return Note.findOne({
                        where: { ingredientIdx: 1, perfumeIdx: 1 },
                    });
                })
                .then((result) => {
                    expect(result).to.be.null;
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
