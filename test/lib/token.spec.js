const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const {
    InvalidTokenError,
    ExpiredTokenError,
} = require('../../src/utils/errors/errors.js');
const jwt = require('../../src/lib/token.js');
const TokenPayloadDTO = require('../../src/data/dto/TokenPayloadDTO.js');

describe('# publish Test', () => {
    it(' # create case', () => {
        const payload = {
            userIdx: 200,
            nickname: '쿼카맨2',
            gender: 'female',
            email: 'hee.youn2@samsung.com',
            birth: 1995,
        };
        const { token, refreshToken } = jwt.publish(payload);
        expect(token.length).gt(0);
        expect(refreshToken.length).gt(0);
    });
});

describe('# create Test', () => {
    it(' # success case', () => {
        const user = {
            userIdx: 200,
            nickname: '쿼카맨2',
            gender: 'female',
            email: 'hee.youn2@samsung.com',
            birth: 1995,
        };
        const payload = new TokenPayloadDTO(user);
        const token = jwt.create(payload);
        expect(token.length).to.not.eq(0);
    });
});

describe('# verify Test', () => {
    let token;
    const payload = {
        userIdx: 200,
        nickname: '쿼카맨2',
        gender: 'female',
        email: 'hee.youn2@samsung.com',
        birth: 1995,
    };
    before(() => {
        token = jwt.create(payload);
    });
    it(' # success case', () => {
        const result = jwt.verify(token);
        delete result.iat;
        delete result.exp;
        delete result.iss;
        expect({ ...result }).to.deep.eq({ ...payload });
    });
    it(' # fail case (Expired Token)', (done) => {
        const jwtSecret = process.env.JWT_SECRET;
        const expiredToken = require('jsonwebtoken').sign(payload, jwtSecret, {
            expiresIn: '1s',
            issuer: 'afume-jackpot',
        });
        setTimeout(() => {
            try {
                jwt.verify(expiredToken);
                expect(false).eq(true);
                done();
            } catch (err) {
                expect(err).instanceOf(ExpiredTokenError);
                done();
            }
        }, 2000);
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
    let refreshToken;
    const payload = new TokenPayloadDTO({
        userIdx: 200,
        nickname: '쿼카맨2',
        gender: 'female',
        email: 'hee.youn2@samsung.com',
        birth: 1995,
    });
    before(() => {
        const result = jwt.publish(payload);
        token = result.token;
        refreshToken = result.refreshToken;
    });
    it('# success case', () => {
        const tokenStr = jwt.reissue(refreshToken);
        const result = jwt.verify(tokenStr);
        expect(result).to.be.instanceOf(TokenPayloadDTO);
        expect({ ...result }).to.deep.eq({ ...payload });
    });
});
