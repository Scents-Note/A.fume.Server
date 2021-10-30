const dotenv = require('dotenv');
dotenv.config();

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../../src/index.js');

const basePath = '/A.fume/api/0.0.1';

const Ingredient = require('../../src/controllers/Ingredient.js');
const IngredientDTO = require('../data/dto/IngredientDTO');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO');

const mockIngredientService = {};
Ingredient.setIngredientService(mockIngredientService);

describe('# Ingredient Controller Test', () => {
    describe('# getIngredientAll Test', () => {
        mockIngredientService.getIngredientAll = async () => {
            const seriesIdx = 1;
            return new ListAndCountDTO({
                count: 5,
                rows: [1, 2, 3, 4, 5].map((idx) =>
                    IngredientDTO.createWithIdx({
                        ingredientIdx: idx,
                        seriesIdx,
                    })
                ),
            });
        };
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
});
