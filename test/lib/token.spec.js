const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const {
    expect
} = chai;
const {
    InvalidTokenError,
    ExpiredTokenError
} = require('../../utils/errors/errors.js');
const jwt = require('../../lib/token.js');

describe('# publish Test', () => {
    it(' # create case', () => {
        const payload = {
            userIdx: 200,
            nickname: '쿼카맨2',
            gender: 'female',
            phone: '010-2081-38',
            email: 'hee.youn2@samsung.com',
            birth: 1995
        };
        const {
            token,
            refreshToken
        } = jwt.publish(payload);
        expect(token.length).gt(0);
        expect(refreshToken.length).gt(0);
    });
});


describe('# create Test', () => {
    it(' # success case', () => {
        const token = jwt.create({
            userIdx: 200,
            nickname: '쿼카맨2',
            gender: 'female',
            phone: '010-2081-38',
            email: 'hee.youn2@samsung.com',
            birth: 1995
        });
        expect(token.length).to.not.eq(0);
    });
});

describe('# verify Test', () => {
    let token;
    const payload = {
        userIdx: 200,
        nickname: '쿼카맨2',
        gender: 'female',
        phone: '010-2081-38',
        email: 'hee.youn2@samsung.com',
        birth: 1995
    };
    before(() => {
        token = jwt.create(payload);
    });
    it(' # success case', () => {
        const result = jwt.verify(token);
        delete result.iat;
        delete result.exp;
        delete result.iss;
        expect(result).to.deep.eq(payload);
    });
    it(' # fail case (Expired Token)', () => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4IjoxLCJlbWFpbCI6ImhlZS55b3VuQHNhbXN1bmcuY29tIiwibmlja25hbWUiOiLsv7zsubTrp6giLCJnZW5kZXIiOjEsInBob25lIjoiMDEwLTIwODEtMzgxOCIsImJpcnRoIjoxOTk1LCJncmFkZSI6MCwiYWNjZXNzVGltZSI6IjIwMjEtMDEtMDVUMTI6NTg6MTAuMDAwWiIsImNyZWF0ZWRBdCI6IjIwMjEtMDEtMDVUMTI6NTg6MTAuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjEtMDEtMDVUMTI6NTg6MTAuMDAwWiIsImlhdCI6MTYwOTg1MTQ5MywiZXhwIjoxNjExNTc5NDkzLCJpc3MiOiJhZnVtZS1qYWNrcG90In0.sVzdA4L4w-kHDImSpW0j2L30UhBKhVZTrlT1wMrzygw';
        try {
            jwt.verify(expiredToken);
            expect(false).eq(true);
        } catch (err) {
            expect(err).instanceOf(ExpiredTokenError);
        }
    });
    it(' # fail case (Invalid Token)', () => {
        try {
            jwt.verify(token + 'a');
            expect(false).eq(true);
        } catch (err) {
            expect(err).instanceOf(InvalidTokenError);
        }
    });
});


describe('# reissue Test', () => {
    let token, refreshToken;
    const payload = {
        userIdx: 200,
        nickname: '쿼카맨2',
        gender: 'female',
        phone: '010-2081-38',
        email: 'hee.youn2@samsung.com',
        birth: 1995
    };
    before(() => {
        const result = jwt.publish(payload);
        token = result.token;
        refreshToken = result.refreshToken;
    });
    it('# success case', () => {
        const tokenStr = jwt.reissue(refreshToken);
        const result = jwt.verify(tokenStr);
        delete result.iat;
        delete result.exp;
        delete result.iss;
        expect(result).to.deep.eq(payload);
    });
});
