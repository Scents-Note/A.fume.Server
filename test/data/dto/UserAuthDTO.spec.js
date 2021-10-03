'use strict';
const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const UserAuthDTO = require('../../../data/dto/UserAuthDTO.js');

const { GRADE_MANAGER, GRADE_USER } = require('../../../utils/constantUtil');

describe('# UserAuthDTO Test', () => {
    describe('# create Test', () => {
        it('# admin case', () => {
            const { isAuth, isAdmin } = UserAuthDTO.create({
                grade: GRADE_MANAGER,
            });
            expect(isAuth).to.be.true;
            expect(isAdmin).to.be.true;
        });
        it('# not admin case', () => {
            const { isAuth, isAdmin } = UserAuthDTO.create({
                grade: GRADE_USER,
            });
            expect(isAuth).to.be.true;
            expect(isAdmin).to.be.false;
        });
    });
});
