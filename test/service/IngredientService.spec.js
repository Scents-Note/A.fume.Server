const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;

const IngredientDTO = require('../data/dto/IngredientDTO');

const ingredientService = require('../../service/IngredientService');
ingredientService.setIngredientDao(require('../dao/IngredientDao.mock.js'));
ingredientService.setSeriesDao(require('../dao/SeriesDao.mock.js'));

const ListAndCountDTO = require('../data/dto/ListAndCountDTO').create(
    (item) => {
        expect(item).instanceOf(IngredientDTO);
        item.validTest();
    }
);

describe('# Ingredient Service Test', () => {
    describe('# getIngredientList Test', () => {
        it('# success Test', (done) => {
            ingredientService
                .getIngredientList(1)
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    result.validTest();
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
