const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const UserAuthDTO = require('../../../data/dto/UserAuthDTO.js');

describe('# UserAuthDTO Test', () => {
    describe('# create Test', () => {
        it('# admin case', () => {
            const { isAuth, isAdmin } = UserAuthDTO.create({ grade: 1 });
            expect(isAuth).to.be.true;
            expect(isAdmin).to.be.true;
        });
        it('# not admin case', () => {
            const { isAuth, isAdmin } = UserAuthDTO.create({ grade: 0 });
            expect(isAuth).to.be.true;
            expect(isAdmin).to.be.false;
        });
    });
});
