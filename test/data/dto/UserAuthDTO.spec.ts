import dotenv from 'dotenv';
import { expect } from 'chai';
dotenv.config();

import UserAuthDTO from '../../../src/data/dto/UserAuthDTO';
import UserMockHelper from './UserMockHelper';

const {
    GRADE_MANAGER,
    GRADE_USER,
} = require('../../../src/utils/constantUtil');

describe('# UserAuthDTO Test', () => {
    describe('# create Test', () => {
        it('# admin case', () => {
            const userAuthDTO: UserAuthDTO = UserAuthDTO.create(
                UserMockHelper.createMock({
                    grade: GRADE_MANAGER,
                })
            );
            expect(userAuthDTO.isAuth).to.be.true;
            expect(userAuthDTO.isAdmin).to.be.true;
        });
        it('# not admin case', () => {
            const userAuthDTO: UserAuthDTO = UserAuthDTO.create(
                UserMockHelper.createMock({
                    grade: GRADE_USER,
                })
            );
            expect(userAuthDTO.isAuth).to.be.true;
            expect(userAuthDTO.isAdmin).to.be.false;
        });
    });
});
