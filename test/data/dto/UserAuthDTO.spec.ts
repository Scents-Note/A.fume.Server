import dotenv from 'dotenv';
import { expect } from 'chai';
dotenv.config();

import { GRADE_MANAGER, GRADE_USER } from '@utils/constants';

import { UserAuthDTO } from '@dto/index';

import UserMockHelper from '../../mock_helper/UserMockHelper';

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
