import dotenv from 'dotenv';
// import { expect } from 'chai';
// import { Done } from 'mocha';
// import request from 'supertest';
dotenv.config();

// import { MSG_GET_SEARCH_INGREDIENT_SUCCESS, BASE_PATH } from '@utils/strings';
// import StatusCode from '@utils/statusCode';

// import { IngredientDTO, ListAndCountDTO } from '@dto/index';

// import IngredientMockHelper from '../mock_helper/IngredientMockHelper';

// import app from '@src/app';

const Ingredient = require('@controllers/Ingredient');

// const basePath: string = BASE_PATH;

const mockIngredientService: any = {};
Ingredient.setIngredientService(mockIngredientService);

describe('# Ingredient Controller Test', () => {
    // describe('# getIngredientAll Test', () => {
    //     mockIngredientService.getIngredientAll = async () => {
    //         const seriesIdx: number = 1;
    //         return new ListAndCountDTO<IngredientDTO>(
    //             5,
    //             [1, 2, 3, 4, 5].map((idx: number) =>
    //                 IngredientMockHelper.createWithIdx(idx, seriesIdx)
    //             )
    //         );
    //     };
    //     it('success case', (done: Done) => {
    //         request(app)
    //             .get(`${basePath}/ingredient`)
    //             .expect((res: any) => {
    //                 expect(res.status).to.be.eq(StatusCode.OK);
    //                 const { message, data } = res.body;
    //                 expect(message).to.be.eq(MSG_GET_SEARCH_INGREDIENT_SUCCESS);
    //                 expect(data.count).to.be.gt(0);
    //                 for (const item of data.rows) {
    //                     expect(item).to.be.have.property('ingredientIdx');
    //                     expect(item).to.be.have.property('name');
    //                     expect(Object.entries(item).length).to.be.eq(2);
    //                 }
    //                 done();
    //             })
    //             .catch((err: Error) => done(err));
    //     });
    // });
});
