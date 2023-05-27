import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';

dotenv.config();

import IngredientService from '@services/IngredientService';
import IngredientDao from '@dao/IngredientDao';

import { IngredientDTO, ListAndCountDTO } from '@dto/index';

import IngredientMockHelper from '../mock_helper/IngredientMockHelper';

const ingredientService = new IngredientService();
const mockIngredientDAO: any | IngredientDao = {};
ingredientService.setIngredientDao(mockIngredientDAO);

describe('# Ingredient Service Test', () => {
    describe('# read test', () => {
        describe('# getIngredientAll Test', () => {
            mockIngredientDAO.readAll = async (where: any = {}) => {
                const seriesIdx = where.seriesIdx || 1;
                return new ListAndCountDTO<IngredientDTO>(
                    5,
                    [1, 2, 3, 4, 5].map((idx: number) =>
                        IngredientMockHelper.createWithIdx(idx, seriesIdx)
                    )
                );
            };
            it('# success Test', (done: Done) => {
                ingredientService
                    .getIngredientAll()
                    .then((res: ListAndCountDTO<IngredientDTO>) => {
                        expect(res.count).to.be.gt(0);
                        expect(res.rows.length).to.be.gt(0);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# getIngredientList Test', () => {
            mockIngredientDAO.readAll = async (where: any = {}) => {
                const seriesIdx = where.seriesIdx || 1;
                return new ListAndCountDTO<IngredientDTO>(
                    5,
                    [1, 2, 3, 4, 5].map((idx: number) =>
                        IngredientMockHelper.createWithIdx(idx, seriesIdx)
                    )
                );
            };
            it('# success Test', (done: Done) => {
                ingredientService
                    .getIngredientList(1)
                    .then((res: ListAndCountDTO<IngredientDTO>) => {
                        expect(res.count).to.be.gt(0);
                        expect(res.rows.length).to.be.gt(0);
                        res.rows.forEach((item: IngredientDTO) => {
                            expect(item.seriesIdx).to.be.eq(1);
                        });
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
    });
});
