const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const perfumeDao = require('../../dao/PerfumeDao.js');
const {
    Brand,
    Series,
    Perfume,
    PerfumeDetail,
    User,
    LikePerfume,
    Wishlist,
    SearchHistory,
    Sequelize,
    sequelize,
} = require('../../models');

describe('# perfumeDao Test', () => {
    before(() => {
        sequelize.sync();
    });
    before(async () => {
        await sequelize.sync();
        await Brand.upsert({
            brandIdx: 1,
            name: '조 말론 런던',
            startCharacter: 'ㅈ',
            englishName: 'Jo Malone London',
            imageUrl: '',
            description: '브랜드',
        });
        await Brand.upsert({
            brandIdx: 2,
            name: '브랜드1',
            startCharacter: 'ㅂ',
            englishName: 'brand1',
            imageUrl: '',
            description: '브랜드',
        });
        await Brand.upsert({
            brandIdx: 3,
            name: '브랜드2',
            startCharacter: 'ㅂ',
            englishName: 'brand2',
            imageUrl: '',
            description: '브랜드',
        });
        await Brand.upsert({
            brandIdx: 4,
            name: '브랜드3',
            startCharacter: 'ㅂ',
            englishName: 'brand3',
            imageUrl: '',
            description: '브랜드',
        });
        await Series.upsert({
            seriesIdx: 1,
            name: '플로럴',
            englishName: 'Floral',
            description: '',
        });
        await Series.upsert({
            seriesIdx: 2,
            name: '오리엔탈',
            englishName: 'Oriental',
            description: '',
        });
        await Series.upsert({
            seriesIdx: 3,
            name: '시트러스',
            englishName: 'Citrus',
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
            brandIdx: 2,
            mainSeriesIdx: 1,
            name: '향수1',
            englishName: 'perfume1',
            imageThumbnailUrl: '',
            releaseDate: '2021-01-01',
        });
        await Perfume.upsert({
            perfumeIdx: 3,
            brandIdx: 3,
            mainSeriesIdx: 2,
            name: '향수2',
            englishName: 'perfume2',
            imageThumbnailUrl: '',
            releaseDate: '2021-01-02',
        });
        await Perfume.upsert({
            perfumeIdx: 4,
            brandIdx: 4,
            mainSeriesIdx: 3,
            name: '향수3',
            englishName: 'perfume3',
            imageThumbnailUrl: '',
            releaseDate: '2021-01-03',
        });
        await Perfume.upsert({
            perfumeIdx: 5,
            brandIdx: 2,
            mainSeriesIdx: 2,
            name: '향수4',
            englishName: 'perfume4',
            imageThumbnailUrl: '',
            releaseDate: '2021-01-04',
        });
        await PerfumeDetail.upsert({
            perfumeIdx: 1,
            story: '스토리',
            abundanceRate: 1,
            imageUrl: '',
            volumeAndPrice: '{"30":"95000","100":"190000"}',
        });
        await PerfumeDetail.upsert({
            perfumeIdx: 2,
            story: '스토리',
            abundanceRate: 2,
            imageUrl: '',
            volumeAndPrice: '{"30":"95000","100":"190000"}',
        });
        await PerfumeDetail.upsert({
            perfumeIdx: 3,
            story: '스토리',
            abundanceRate: 3,
            imageUrl: '',
            volumeAndPrice: '{"30":"95000","100":"190000"}',
        });
        await PerfumeDetail.upsert({
            perfumeIdx: 4,
            story: '스토리',
            abundanceRate: 4,
            imageUrl: '',
            volumeAndPrice: '{"30":"95000","100":"190000"}',
        });
        await PerfumeDetail.upsert({
            perfumeIdx: 5,
            story: '스토리',
            abundanceRate: 1,
            imageUrl: '',
            volumeAndPrice: '{}',
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
        await User.upsert({
            userIdx: 2,
            nickname: '쿼카맨2',
            password: 'dummy',
            gender: 1,
            phone: '010-2081-3718',
            email: 'heesung6702@naver.com',
            birth: '1995',
            grade: 1,
        });
        await Wishlist.upsert({ userIdx: 1, perfumeIdx: 1, priority: 1 });
        await Wishlist.upsert({ userIdx: 1, perfumeIdx: 2, priority: 2 });
        await Wishlist.upsert({ userIdx: 1, perfumeIdx: 3, priority: 3 });
        await Wishlist.upsert({ userIdx: 1, perfumeIdx: 4, priority: 4 });
        await Wishlist.upsert({ userIdx: 1, perfumeIdx: 5, priority: 5 });
        await LikePerfume.upsert({ userIdx: 1, perfumeIdx: 1 });
        await LikePerfume.upsert({ userIdx: 1, perfumeIdx: 2 });
        await LikePerfume.upsert({ userIdx: 2, perfumeIdx: 3 });
        await LikePerfume.upsert({ userIdx: 2, perfumeIdx: 1 });
        await SearchHistory.upsert({ userIdx: 1, perfumeIdx: 1 });
        await SearchHistory.upsert({ userIdx: 1, perfumeIdx: 2 });
        await SearchHistory.upsert({ userIdx: 1, perfumeIdx: 3 });
        await SearchHistory.upsert({ userIdx: 2, perfumeIdx: 1 });
    });
    describe('# create Test', () => {
        before(async () => {
            await Perfume.destroy({ where: { name: '삽입테스트' } });
        });
        it('# success case', (done) => {
            const perfumeObj = {
                name: '삽입테스트',
                mainSeriesIdx: 1,
                brandIdx: 1,
                englishName: 'insert Test',
                volumeAndPrice: {},
                imageThumbnailUrl: 'URL',
                story: '스토리',
                abundanceRate: 2,
                imageUrl: 'image_url',
                releaseDate: '2020-11-29',
            };
            perfumeDao
                .create(perfumeObj)
                .then((result) => {
                    return perfumeDao.readByPerfumeIdx(result);
                })
                .then((result) => {
                    expect(result.name).to.equal('삽입테스트');
                    expect(result.Brand.name).to.equal('조 말론 런던');
                    expect(result.MainSeries.name).to.equal('플로럴');
                    expect(result.PerfumeDetail.volumeAndPrice).to.deep.equal(
                        []
                    );
                    done();
                })
                .catch((err) => done(err));
        });
        it('# DuplicatedEntry Error case', (done) => {
            perfumeDao
                .create({
                    name: '삽입테스트',
                    mainSeriesIdx: 1,
                    brandIdx: 1,
                    englishName: 'insert Test',
                    volumeAndPrice: '{}',
                    imageThumbnailUrl: 'URL',
                    story: '스토리',
                    abundanceRate: 2,
                    imageUrl: 'image_url',
                    releaseDate: '2020-11-29',
                })
                .then(() => {
                    throw new Error('Must be occur DuplicatedEntryError');
                })
                .catch((err) => {
                    expect(err.parent.errno).eq(1062);
                    expect(err.parent.code).eq('ER_DUP_ENTRY');
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
                        expect(result.name).to.equal(
                            '오토니엘 로사 오 드 뚜왈렛'
                        );
                        expect(result.Brand.name).to.equal('조 말론 런던');
                        expect(result.MainSeries.name).to.equal('플로럴');
                        expect(result.PerfumeDetail.story).to.equal('스토리');
                        expect(result.PerfumeDetail.abundanceRate).to.equal(1);
                        expect(
                            result.PerfumeDetail.volumeAndPrice
                        ).to.deep.equal([
                            { volume: 30, price: 95000 },
                            { volume: 100, price: 190000 },
                        ]);
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# search Test', () => {
            it('# success case (series & grand & order by recent)', (done) => {
                const filter = {
                    series: ['플로럴', '오리엔탈'],
                    brands: ['브랜드1', '브랜드2', '브랜드3'],
                };
                perfumeDao
                    .search(filter, [['createdAt', 'asc']])
                    .then((result) => {
                        expect(result.length).to.gte(3);
                        result.forEach((it) => {
                            filter.series &&
                                filter.series.length > 0 &&
                                expect(
                                    filter.series.indexOf(it.MainSeries.name)
                                ).to.not.eq(-1);
                            filter.brands &&
                                filter.brands.length > 0 &&
                                expect(
                                    filter.brands.indexOf(it.Brand.name)
                                ).to.not.eq(-1);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('# success case (empty filter)', (done) => {
                perfumeDao
                    .search({})
                    .then((result) => {
                        expect(result.length).gt(3);
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# success case (series)', (done) => {
                const filter = {
                    series: ['플로럴', '우디', '시트러스'],
                };
                perfumeDao
                    .search(filter)
                    .then((result) => {
                        expect(result.length).gte(3);
                        result.forEach((it) => {
                            filter.series &&
                                filter.series.length > 0 &&
                                expect(
                                    filter.series.indexOf(it.MainSeries.name)
                                ).to.not.eq(-1);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# success case (brand)', (done) => {
                const filter = {
                    brands: ['브랜드1'],
                };
                perfumeDao
                    .search(filter)
                    .then((result) => {
                        expect(result.length).to.gte(2);
                        result.forEach((it) => {
                            filter.brands &&
                                filter.brands.length > 0 &&
                                expect(
                                    filter.brands.indexOf(it.Brand.name)
                                ).to.not.eq(-1);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# success case (series & order by like) ', (done) => {
                const filter = {
                    series: ['플로럴'],
                };
                perfumeDao
                    .search(filter, [['likeCnt', 'asc']])
                    .then((result) => {
                        expect(result.length).gte(2);
                        result.forEach((it) => {
                            filter.series &&
                                filter.series.length > 0 &&
                                expect(
                                    filter.series.indexOf(it.MainSeries.name)
                                ).to.not.eq(-1);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# success case (order by recent)', (done) => {
                perfumeDao
                    .search({}, [['releaseDate', 'desc']])
                    .then((result) => {
                        expect(result.length).gte(3);
                        const str1 = result
                            .map((it) => it.releaseDate)
                            .join(',');
                        const str2 = result
                            .map((it) => it.releaseDate)
                            .sort()
                            .reverse()
                            .join(',');
                        expect(str1).eq(str2);
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# success case (order by like) ', (done) => {
                perfumeDao
                    .search({}, [['likeCnt', 'asc']])
                    .then((result) => {
                        expect(result.length).gte(3);
                        const str1 = result.map((it) => it.like).join(',');
                        const str2 = result
                            .map((it) => it.like)
                            .sort()
                            .reverse()
                            .join(',');
                        expect(str1).eq(str2);
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# success case (order by random) ', (done) => {
                Promise.all([
                    perfumeDao.search({}, [Sequelize.fn('RAND')]),
                    perfumeDao.search({}, [Sequelize.fn('RAND')]),
                    perfumeDao.search({}, [Sequelize.fn('RAND')]),
                ])
                    .then(([result1, result2, result3]) => {
                        expect(result1.length).gte(3);
                        expect(result2.length).gte(3);
                        expect(result3.length).gte(3);
                        const str1 = result1
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        const str2 = result2
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        const str3 = result3
                            .map((it) => it.perfumeIdx)
                            .join(',');
                        expect(str1 == str2 && str1 == str3).eq(false);
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        it('# read all of wishlist', (done) => {
            perfumeDao
                .readAllOfWishlist(1)
                .then((result) => {
                    expect(result.length).gte(3);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# recent search perfume List', (done) => {
            perfumeDao
                .recentSearchPerfumeList(1)
                .then((result) => {
                    expect(result.length).gte(3);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    throw err;
                });
        });

        it('# recommend perfume by age and gender', (done) => {
            perfumeDao
                .recommendPerfumeByAgeAndGender(1, '남자', 0, 2020)
                .then((result) => {
                    expect(result.length).gte(3);
                    done();
                })
                .catch((err) => done(err));
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
                mainSeriesIdx: 1,
                name: '수정 테스트',
                englishName: 'perfume_delete_test',
                imageThumbnailUrl: 'URL',
                releaseDate: '2021-01-01',
            });
            perfumeIdx = dataValues.perfumeIdx;
            await PerfumeDetail.create({
                perfumeIdx: perfumeIdx,
                story: '향수 수정 스토리',
                abundanceRate: 2,
                volumeAndPrice: '{}',
                imageUrl: '이미지 URL',
            });
        });
        it('# success case', (done) => {
            const perfumeObj = {
                perfumeIdx,
                name: '수정된 이름',
                mainSeriesIdx: 2,
                brandIdx: 2,
                englishName: '수정된 영어이름',
                volumeAndPrice: '{}',
                imageThumbnailUrl: '수정된url',
                story: '수정된스토리',
                abundanceRate: 2,
                imageUrl: '수정된 이미지',
                releaseDate: '2020-11-29',
            };
            perfumeDao
                .update(perfumeObj)
                .then((result) => {
                    expect(result.filter((it) => it == 1)).to.lengthOf(2);
                    return perfumeDao.readByPerfumeIdx(perfumeIdx);
                })
                .then((result) => {
                    expect(result.name).to.equal('수정된 이름');
                    expect(result.englishName).to.equal('수정된 영어이름');
                    expect(result.PerfumeDetail.story).to.equal('수정된스토리');
                    expect(result.PerfumeDetail.abundanceRate).to.equal(2);
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
                mainSeriesIdx: 1,
                name: '향수 삭제 테스트',
                englishName: 'perfume_delete_test',
                imageThumbnailUrl: 'URL',
                releaseDate: '2021-01-01',
            });
            perfumeIdx = perfume.perfumeIdx;
            await PerfumeDetail.create({
                perfumeIdx,
                story: '향수 삭제 테스트 용',
                abundanceRate: 2,
                volumeAndPrice: '{}',
                imageUrl: '이미지 URL',
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
                .then((it) => {
                    //expect(it);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
