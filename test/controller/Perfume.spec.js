const dotenv = require('dotenv');
dotenv.config();

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../../index.js');

const basePath = '/A.fume/api/0.0.1';

const Perfume = require('../../controllers/Perfume.js');
const mockPerfumeService = {};
const mockSearchHistoryService = {};
Perfume.setPerfumeService(mockPerfumeService);
Perfume.setSearchHistoryService(mockSearchHistoryService);

describe('# Perfume Controller Test', () => {
    describe('# getPerfume Test', () => {
        it('success case', (done) => {
            mockPerfumeService.getPerfumeById = async () => {
                return {
                    perfumeIdx: 1,
                    name: '향수1',
                    brandName: '브랜드1',
                    story: '스토리1',
                    abundanceRate: '오 드 코롱',
                    volumeAndPrice: [],
                    isLiked: false,
                    Keywords: [],
                    imageUrls: [],
                    noteType: 0,
                    ingredients: {
                        top: '재료1, 재료1, 재료1, 재료1',
                        middle: '재료1',
                        base: '',
                        single: '',
                    },
                    score: 1,
                    seasonal: {
                        spring: 15,
                        summer: 0,
                        fall: 78,
                        winter: 7,
                    },
                    sillage: {
                        light: 7,
                        medium: 86,
                        heavy: 7,
                    },
                    longevity: {
                        veryWeak: 93,
                        weak: 0,
                        normal: 0,
                        strong: 7,
                        veryStrong: 0,
                    },
                    gender: {
                        male: 7,
                        neutral: 7,
                        female: 86,
                    },
                };
            };
            mockSearchHistoryService.incrementCount = async () => {};

            request(app)
                .get(`${basePath}/perfume/1`)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('향수 조회 성공');
                    const properties = [
                        'perfumeIdx',
                        'name',
                        'brandName',
                        'imageUrls',
                        'story',
                        'abundanceRate',
                        'volumeAndPrice',
                        'score',
                        'seasonal',
                        'sillage',
                        'gender',
                        'longevity',
                        'isLiked',
                        'Keywords',
                        'noteType',
                        'ingredients',
                    ];
                    properties.forEach((it) =>
                        expect(data).to.be.have.property(it)
                    );
                    expect(Object.entries(data).length).to.be.eq(
                        properties.length
                    );

                    expect(data.volumeAndPrice).instanceOf(Array);
                    for (const item of data.volumeAndPrice) {
                        expect(item).to.be.match('^[0-9,]+/[0-9,]+ml$');
                    }
                    expect(data.imageUrls).instanceOf(Array);

                    const {
                        score,
                        seasonal,
                        sillage,
                        longevity,
                        gender,
                        Keywords,
                        ingredients,
                        noteType,
                    } = data;
                    expect(score).to.be.within(0, 10);

                    expect(seasonal).to.be.have.property('spring');
                    expect(seasonal).to.be.have.property('summer');
                    expect(seasonal).to.be.have.property('fall');
                    expect(seasonal).to.be.have.property('winter');
                    expect(Object.entries(seasonal).length).to.be.eq(4);
                    const { spring, summer, fall, winter } = seasonal;
                    expect(spring).to.be.within(0, 100);
                    expect(summer).to.be.within(0, 100);
                    expect(fall).to.be.within(0, 100);
                    expect(winter).to.be.within(0, 100);
                    expect(spring + summer + fall + winter).to.be.eq(100);

                    expect(sillage).to.be.have.property('light');
                    expect(sillage).to.be.have.property('medium');
                    expect(sillage).to.be.have.property('heavy');
                    expect(Object.entries(sillage).length).to.be.eq(3);
                    const { light, medium, heavy } = sillage;
                    expect(light).to.be.within(0, 100);
                    expect(medium).to.be.within(0, 100);
                    expect(heavy).to.be.within(0, 100);
                    expect(light + medium + heavy).to.be.eq(100);

                    expect(longevity).to.be.have.property('veryWeak');
                    expect(longevity).to.be.have.property('weak');
                    expect(longevity).to.be.have.property('normal');
                    expect(longevity).to.be.have.property('strong');
                    expect(longevity).to.be.have.property('veryStrong');
                    expect(Object.entries(longevity).length).to.be.eq(5);
                    const { veryWeak, weak, normal, strong, veryStrong } =
                        longevity;
                    expect(veryWeak).to.be.within(0, 100);
                    expect(weak).to.be.within(0, 100);
                    expect(normal).to.be.within(0, 100);
                    expect(strong).to.be.within(0, 100);
                    expect(veryStrong).to.be.within(0, 100);
                    expect(
                        veryWeak + weak + normal + strong + veryStrong
                    ).to.be.eq(100);

                    expect(gender).to.be.have.property('male');
                    expect(gender).to.be.have.property('neutral');
                    expect(gender).to.be.have.property('female');
                    expect(Object.entries(gender).length).to.be.eq(3);
                    const { male, neutral, female } = gender;
                    expect(male).to.be.within(0, 100);
                    expect(neutral).to.be.within(0, 100);
                    expect(female).to.be.within(0, 100);
                    expect(male + neutral + female).to.be.eq(100);

                    expect(Keywords).instanceOf(Array);
                    Keywords.forEach((it) => expect(it).instanceOf(String));

                    expect(noteType).to.be.within(0, 1);

                    expect(ingredients).to.be.have.property('top');
                    expect(ingredients).to.be.have.property('middle');
                    expect(ingredients).to.be.have.property('base');
                    expect(ingredients).to.be.have.property('single');
                    expect(Object.entries(ingredients).length).to.be.eq(4);
                    const { top, middle, base, single } = ingredients;
                    expect(top).to.be.a('string');
                    expect(middle).to.be.a('string');
                    expect(base).to.be.a('string');
                    expect(single).to.be.a('string');
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
