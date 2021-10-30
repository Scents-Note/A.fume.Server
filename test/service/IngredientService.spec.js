const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;

const IngredientDTO = require('../data/dto/IngredientDTO');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO');

const ingredientService = require('../../src/service/IngredientService.js');
const mockIngredientDAO = {};
ingredientService.setIngredientDao(mockIngredientDAO);

describe('# Ingredient Service Test', () => {
    describe('# read test', () => {
        describe('# findSIngredient Test', () => {
            mockIngredientDAO.findIngredient = async (condition) => {
                return IngredientDTO.create(condition);
            };
            it('# success Test', (done) => {
                ingredientService
                    .findIngredient({ name: '재료 이름' })
                    .then((result) => {
                        expect(result).instanceOf(IngredientDTO);
                        IngredientDTO.validTest.call(result);
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# getIngredientAll Test', () => {
            mockIngredientDAO.readAll = async (where = {}) => {
                const seriesIdx = where.seriesIdx || 1;
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
            it('# success Test', (done) => {
                ingredientService
                    .getIngredientAll()
                    .then((result) => {
                        expect(result).instanceOf(ListAndCountDTO);
                        ListAndCountDTO.validTest.call(
                            result,
                            IngredientDTO.validTest
                        );
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# getIngredientList Test', () => {
            mockIngredientDAO.readAll = async (where = {}) => {
                const seriesIdx = where.seriesIdx || 1;
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
            it('# success Test', (done) => {
                ingredientService
                    .getIngredientList(1)
                    .then((result) => {
                        expect(result).instanceOf(ListAndCountDTO);
                        ListAndCountDTO.validTest.call(
                            result,
                            IngredientDTO.validTest
                        );
                        result.rows.forEach((item) => {
                            expect(item.seriesIdx).to.be.eq(1);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });
});
