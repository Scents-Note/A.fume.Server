import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import {
    AbnormalConnectionError,
    UnExpectedError,
} from '@src/utils/errors/errors';

import AuthService from '@services/AuthService';

import { TokenSetDTO, TokenPayloadDTO } from '@dto/index';

import { TokenDao } from '@dao/TokenDao';

import JwtController from '@libs/JwtController';

class MockTokenDao implements TokenDao {
    public tokens: TokenSetDTO[];
    constructor() {
        this.tokens = [];
    }
    async read(accessToken: string): Promise<TokenSetDTO | null> {
        const filtered: TokenSetDTO[] = this.tokens.filter(
            (it) => it.accessToken == accessToken
        );
        if (filtered.length == 0) {
            return null;
        }
        return filtered[0];
    }

    async create(tokenSet: TokenSetDTO): Promise<boolean> {
        const result = await this.read(tokenSet.accessToken);
        if (result != null) {
            return false;
        }
        this.tokens.push(tokenSet);
        return true;
    }

    async update(
        prevAccessToken: string,
        newAccessToken: string
    ): Promise<boolean> {
        const tokenSet: TokenSetDTO | null = await this.read(prevAccessToken);
        if (tokenSet == null) {
            return false;
        }
        const refreshToken: string = tokenSet.refreshToken;
        await this.delete({ accessToken: prevAccessToken });
        await this.create(new TokenSetDTO(newAccessToken, refreshToken));
        return true;
    }

    async delete(condition: any): Promise<boolean> {
        const checker = (tokenSet: TokenSetDTO): boolean => {
            let ret: boolean = false;
            if (condition.accessToken) {
                if (tokenSet.accessToken == condition.accessToken) {
                    ret = true;
                }
            }
            if (condition.refreshToken) {
                if (tokenSet.refreshToken == condition.refreshToken) {
                    ret = true;
                }
            }
            return ret;
        };

        const newTokens: TokenSetDTO[] = [];
        for (const tokenSet of this.tokens) {
            if (!checker(tokenSet)) {
                newTokens.push(tokenSet);
            }
        }
        this.tokens = newTokens;
        return true;
    }
}

const mockTokenDao: MockTokenDao = new MockTokenDao();
const authService: AuthService = new AuthService(mockTokenDao);

describe('# Auth Service Test', () => {
    describe(' # reissueAccessToken test', () => {
        let prevTokenSet: TokenSetDTO;
        let initialTokens: TokenSetDTO[] = [];
        before(async function () {
            const published: any = JwtController.publish(
                new TokenPayloadDTO(1, '', '', '', 0)
            );
            prevTokenSet = new TokenSetDTO(
                published.token,
                published.refreshToken
            );
            initialTokens = [prevTokenSet];
            this.timeout(2000);
            // new token must be different with previous token
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        beforeEach(() => {
            mockTokenDao.tokens = initialTokens;
        });

        it('# success test', (done: Done) => {
            authService
                .reissueAccessToken(prevTokenSet)
                .then((result: string) => {
                    return Promise.all([
                        mockTokenDao.read(prevTokenSet.accessToken),
                        mockTokenDao.read(result),
                    ]);
                })
                .then((result: any[]) => {
                    const actual: TokenSetDTO | null = result[0];
                    expect(actual).to.be.null;
                    const updated: TokenSetDTO | null = result[1];
                    expect(updated).to.be.not.null;
                    expect(updated!!.refreshToken).to.be.eq(
                        prevTokenSet.refreshToken
                    );
                    done();
                })
                .catch((err: Error) => done(err));
        });
        it('# invalid accessToken test', (done: Done) => {
            const invalidAccessToken: string = JwtController.create(
                new TokenPayloadDTO(1, '', '', '', 0)
            );
            expect(invalidAccessToken).to.be.not.eq(prevTokenSet.accessToken);
            authService
                .reissueAccessToken(
                    new TokenSetDTO(
                        invalidAccessToken,
                        prevTokenSet.refreshToken
                    )
                )
                .then((_: string) => {
                    done(new UnExpectedError(AbnormalConnectionError));
                })
                .catch((err: Error) => {
                    expect(err).to.be.instanceOf(AbnormalConnectionError);
                    done();
                });
        });
        it('# invalid refreshToken test', (done: Done) => {
            const invalidRefreshToken: string = JwtController.publish(
                new TokenPayloadDTO(1, '', '', '', 0)
            ).refreshToken;
            expect(invalidRefreshToken).to.be.not.eq(prevTokenSet.refreshToken);
            authService
                .reissueAccessToken(
                    new TokenSetDTO(
                        prevTokenSet.accessToken,
                        invalidRefreshToken
                    )
                )
                .then((_: string) => {
                    done(new UnExpectedError(AbnormalConnectionError));
                })
                .catch((err: Error) => {
                    expect(err).to.be.instanceOf(AbnormalConnectionError);
                    done();
                });
        });
    });
});
