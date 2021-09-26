const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;

const IngredientDTO = require('../data/dto/IngredientDTO');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO');

const ingredientService = require('../../service/IngredientService');
const mockIngredientDAO = Object.assign(
    {},
    require('../dao/IngredientDao.mock.js')
);
ingredientService.setIngredientDao(mockIngredientDAO);

describe('# Ingredient Service Test', () => {
    describe('# read test', () => {
        describe('# findSIngredient Test', () => {
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
            it('# success Test', (done) => {
                ingredientService
                    .getIngredientAll()
                    .then((result) => {
                        expect(result).instanceOf(ListAndCountDTO);
                        result.validTest((item) => {
                            expect(item).instanceOf(IngredientDTO);
                            IngredientDTO.validTest.call(item);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# getIngredientList Test', () => {
            it('# success Test', (done) => {
                ingredientService
                    .getIngredientList(1)
                    .then((result) => {
                        expect(result).instanceOf(ListAndCountDTO);
                        result.validTest((item) => {
                            expect(item).instanceOf(IngredientDTO);
                            IngredientDTO.validTest.call(item);
                            expect(item.seriesIdx).to.be.eq(1);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });
});
