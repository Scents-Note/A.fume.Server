import dotenv from 'dotenv';
import { Done } from 'mocha';
dotenv.config();

import IngredientCategoryDao from '@dao/IngredientCategoryDao';

import { IngredientCategoryDTO } from '@dto/index';
import { expect } from 'chai';

const ingredientCategoryDao = new IngredientCategoryDao();

describe('# ingredientCategoryDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe(' # readAll test', () => {
        it(' # success case', (done: Done) => {
            ingredientCategoryDao
                .readAll({})
                .then((result: IngredientCategoryDTO[]) => {
                    for (let i = 1; i <= 5; i++) {
                        expect(result[i - 1].id).to.be.eq(i);
                        expect(result[i - 1].name).to.be.not.null;
                        expect(result[i - 1].usedCountOnPerfume).to.be.gte(0);
                    }
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
