const dotenv = require('dotenv');
dotenv.config();

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../../index.js');

const basePath = '/A.fume/api/0.0.1';

const Perfume = require('../../controllers/Perfume.js');
const PerfumeDetailResponseDTO = require('../data/response_dto/perfume/PerfumeDetailResponseDTO');
const PerfumeResponseDTO = require('../data/response_dto/perfume/PerfumeResponseDTO');

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
                    PerfumeDetailResponseDTO.validTest.call(data);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
