import dotenv from 'dotenv';
dotenv.config();
import { Done } from 'mocha';
import request from 'supertest';
import { expect } from 'chai';

import IngredientMockHelper from '../data/dto/IngredientMockHelper';
import StatusCode from '../../src/utils/statusCode';

const app = require('../../src/index.js');

const basePath = '/A.fume/api/0.0.1';

const Ingredient = require('../../src/controllers/Ingredient.ts');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO');

const mockIngredientService: any = {};
Ingredient.setIngredientService(mockIngredientService);

describe('# Ingredient Controller Test', () => {
    describe('# getIngredientAll Test', () => {
        mockIngredientService.getIngredientAll = async () => {
            const seriesIdx: number = 1;
            return new ListAndCountDTO({
                count: 5,
                rows: [1, 2, 3, 4, 5].map((idx: number) =>
                    IngredientMockHelper.createWithIdx(idx, seriesIdx)
                ),
            });
        };
        it('success case', (done: Done) => {
            request(app)
                .get(`${basePath}/ingredient`)
                .expect((res: any) => {
                    expect(res.status).to.be.eq(StatusCode.OK);

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
                .catch((err: Error) => done(err));
        });
    });
});
