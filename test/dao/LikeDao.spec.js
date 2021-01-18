const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const likeDao = require('../../dao/LikeDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError,
} = require('../../utils/errors/errors.js');
const {
    sequelize,
    Perfume,
    User,
    Brand,
    Series,
    LikePerfume,
} = require('../../models');

describe('# likeDao Test', () => {
    before(async () => {
        sequelize.sync();
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
        await Perfume.upsert({
            perfumeIdx: 2,
            brandIdx: 1,
            mainSeriesIdx: 1,
            name: '오토니엘 로사 오 드 뚜왈렛2',
            englishName: 'OTHONIEL ROSA EAU DE TOILETTE',
            imageThumbnailUrl: '',
            releaseDate: '2020-12-30',
        });
        await User.upsert({
            userIdx: 1,
            nickname: '쿼카맨',
            password: 'dummy',
            gender: 1,
            phone: '010-2081-3818',
            email: 'heesung6701@naver.com',
            birth: '1995',
            grade: 1,
        });
        await LikePerfume.upsert({
            userIdx: 1,
            perfumeIdx: 2,
        });
    });
    describe('# create Test', () => {
        before(async () => {
            await LikePerfume.destroy({ where: { userIdx: 1, perfumeIdx: 1 } });
        });
        it('# success case', (done) => {
            likeDao
                .create(1, 1)
                .then((result) => {
                    expect(result).to.be.not.null;
                    done();
                })
                .catch((err) => done(err));
        });
        it('# DuplicatedEntryError case', (done) => {
            likeDao
                .create(1, 1)
                .then(() => {
                    done(new Error('must be expected DuplicatedEntryError'));
                })
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# read case', () => {
        it('# success case', (done) => {
            likeDao.read(1, 2).then((result) => {
                expect(result.userIdx).eq(1);
                expect(result.perfumeIdx).eq(2);
                done();
            });
        });

        it('# fail case', (done) => {
            likeDao
                .read(-1, 1)
                .then(() =>
                    done(new Error('must be expected DuplicatedEntryError'))
                )
                .catch((err) => {
                    expect(err).instanceof(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# delete Test', () => {
        before(async () => {
            LikePerfume.upsert({
                userIdx: 1,
                perfumeIdx: 2,
            });
        });
        it('# success case', (done) => {
            likeDao.delete(1, 2).then((result) => {
                expect(result).eq(1);
                done();
            });
        });
    });
});
