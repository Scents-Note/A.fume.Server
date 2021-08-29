const dotenv = require('dotenv');
dotenv.config();

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../../index.js');

const basePath = '/A.fume/api/0.0.1';

const Ingredient = require('../../controllers/Ingredient.js');
const mockIngredientService = Object.assign(
    {},
    require('../service/IngredientService.mock.js')
);
Ingredient.setIngredientService(mockIngredientService);

describe('# Ingredient Controller Test', () => {
    describe('# getIngredientAll Test', () => {
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/ingredient`)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;

                    expect(message).to.be.eq('재료 검색 성공');
                    expect(data.count).to.be.gt(0);
                    for (const item of data.rows) {
                        expect(item).to.be.have.property('ingredientIdx');
                        expect(item).to.be.have.property('name');
                        expect(Object.entries(item).length).to.be.eq(2);
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getIngredientByEnglishName Test', () => {
        it('success case', (done) => {
            request(app)
                .post(`${basePath}/ingredient/find`)
                .send({ seriesIdx: 4 })
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;

                    expect(message).to.be.eq('재료 조회 성공');
                    expect(data).to.be.have.property('ingredientIdx');
                    expect(data).to.be.have.property('name');
                    expect(Object.entries(data).length).to.be.eq(2);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
