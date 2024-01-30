import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import { TokenDao, TokenDaoSequelize } from '@dao/TokenDao';

import { TokenSetDTO } from '@dto/index';

import { Token } from '@sequelize';

const tokenDao: TokenDao = new TokenDaoSequelize();

describe('# seriesDao Test', () => {
    describe('# read Test', () => {
        before(async function () {
            await Token.create({
                accessToken: 'tokenA',
                refreshToken: 'refreshTokenA',
            });
        });
        it('# success case(readyByIdx)', (done: Done) => {
            tokenDao
                .read('tokenA')
                .then((result: TokenSetDTO | null) => {
                    expect(result).is.not.null;
                    const tokenSet: TokenSetDTO = result!!;
                    expect(tokenSet.accessToken).to.be.eq('tokenA');
                    expect(tokenSet.refreshToken).to.be.eq('refreshTokenA');
                    done();
                })
                .catch((err) => done(err));
        });

        after(async function () {
            await Token.destroy({
                where: { accessToken: 'tokenA' },
            });
        });
    });

    describe(' # create Test', () => {
        it(' # success case', (done: Done) => {
            tokenDao
                .create(new TokenSetDTO('tokenB', 'refreshTokenB'))
                .then((result: boolean) => {
                    expect(result).to.be.eq(true);
                    return Token.findOne({ where: { accessToken: 'tokenB' } });
                })
                .then((result: any) => {
                    expect(result).to.be.not.null;
                    done();
                })
                .catch((err: Error) => done(err));
        });

        after(async function () {
            await Token.destroy({
                where: { accessToken: 'tokenB' },
            });
        });
    });

    describe(' # update Test', () => {
        before(async function () {
            await Token.create({
                accessToken: 'tokenA',
                refreshToken: 'refreshTokenA',
            });
        });
        it(' # success case', (done: Done) => {
            tokenDao
                .update('tokenA', 'tokenB')
                .then((result: boolean) => {
                    expect(result).to.be.eq(true);
                    return Token.findOne({ where: { accessToken: 'tokenB' } });
                })
                .then((result: any) => {
                    expect(result).to.be.not.null;
                    return Token.findOne({ where: { accessToken: 'tokenA' } });
                })
                .then((result: any) => {
                    expect(result).to.be.null;
                    done();
                })
                .catch((err: Error) => done(err));
        });

        after(async function () {
            await Token.destroy({
                where: { accessToken: 'tokenA' },
            });
        });
    });

    describe(' # delete Test', () => {
        before(async function () {
            await Token.create({
                accessToken: 'tokenA',
                refreshToken: 'refreshTokenA',
            });
        });
        it(' # success case', (done: Done) => {
            tokenDao
                .delete({ refreshToken: 'refreshTokenA' })
                .then((result: boolean) => {
                    expect(result).to.be.eq(true);
                    return Token.findOne({ where: { accessToken: 'tokenA' } });
                })
                .then((result: any) => {
                    expect(result).to.be.null;
                    done();
                })
                .catch((err: Error) => done(err));
        });

        after(async function () {
            await Token.destroy({
                where: { accessToken: 'tokenA' },
            });
        });
    });
});
