import dotenv from 'dotenv';
dotenv.config();

import jsonwebtoken from 'jsonwebtoken';
import JwtController from '../../src/lib/JwtController';
import { expect } from 'chai';

import {
    InvalidTokenError,
    ExpiredTokenError,
} from '../../src/utils/errors/errors';

import TokenPayloadDTO from '../../src/data/dto/TokenPayloadDTO';

describe('# publish Test', () => {
    it(' # create case', () => {
        const payload: TokenPayloadDTO = new TokenPayloadDTO(
            200,
            '쿼카맨2',
            'female',
            'hee.youn2@samsung.com',
            1995
        );
        const { token, refreshToken } = JwtController.publish(payload);
        expect(token.length).gt(0);
        expect(refreshToken.length).gt(0);
    });
});

describe('# create Test', () => {
    it(' # success case', () => {
        const payload: TokenPayloadDTO = new TokenPayloadDTO(
            200,
            '쿼카맨2',
            'female',
            'hee.youn2@samsung.com',
            1995
        );
        const token = JwtController.create(payload);
        expect(token.length).to.not.eq(0);
    });
});

describe('# verify Test', () => {
    const payload: TokenPayloadDTO = new TokenPayloadDTO(
        200,
        '쿼카맨2',
        'female',
        'hee.youn2@samsung.com',
        1995
    );
    const token: string = JwtController.create(payload);
    it(' # success case', () => {
        const result: TokenPayloadDTO = JwtController.verify(token);
        expect({ ...result }).to.deep.eq({ ...payload });
    });
    it(' # fail case (Expired Token)', (done) => {
        const jwtSecret: string = process.env.JWT_SECRET || 'secretKey';
        const expiredToken = jsonwebtoken.sign({ ...payload }, jwtSecret, {
            expiresIn: '1s',
            issuer: 'afume-jackpot',
        });
        setTimeout(() => {
            try {
                JwtController.verify(expiredToken);
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
            JwtController.verify(token + 'a');
            expect(false).eq(true);
        } catch (err: any) {
            expect(err).instanceOf(InvalidTokenError);
        }
    });
});

describe('# reissue Test', () => {
    it('# success case', () => {
        const payload = new TokenPayloadDTO(
            200,
            '쿼카맨2',
            'female',
            'hee.youn2@samsung.com',
            1995
        );
        const refreshToken: string =
            JwtController.publish(payload).refreshToken;
        const tokenStr: string = JwtController.reissue(refreshToken);
        const result: TokenPayloadDTO = JwtController.verify(tokenStr);
        expect({ ...result }).to.deep.eq({ ...payload });
    });
});
