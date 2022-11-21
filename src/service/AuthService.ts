import { logger } from '@modules/winston';

import { TokenSetDTO } from '@dto/index';

const LOG_TAG: string = '[Auth/Service]';

import JwtController from '@libs/JwtController';
import { TokenDao, TokenDaoSequelize } from '@dao/TokenDao';
import { AbnormalConnectionError } from '@src/utils/errors/errors';
import { Op } from 'sequelize';

class AuthService {
    readonly tokenDao: TokenDao;
    constructor(tokenDao: TokenDao = new TokenDaoSequelize()) {
        this.tokenDao = tokenDao;
    }

    /**
     * 토큰 재발행
     *
     * @param {tokenSet} TokenSetDTO
     **/
    reissueAccessToken(tokenSet: TokenSetDTO): Promise<string> {
        logger.debug(`${LOG_TAG} reissueAccessToken(tokenSet = ${tokenSet})`);
        let newToken: string;
        return this.tokenDao
            .read(tokenSet.accessToken)
            .then((recent: TokenSetDTO | null) => {
                if (
                    recent == null ||
                    recent.refreshToken != tokenSet.refreshToken
                ) {
                    throw new AbnormalConnectionError();
                }
                newToken = JwtController.reissue(tokenSet.refreshToken);
                return this.tokenDao.update(tokenSet.accessToken, newToken);
            })
            .then((isSuccess: boolean) => {
                if (isSuccess == false) {
                    logger.error(
                        'failed to update token storage with new access token'
                    );
                }
                return newToken;
            })
            .catch(async (err: Error) => {
                if (err instanceof AbnormalConnectionError) {
                    logger.error('AbnormalConnectionError');
                    return this.tokenDao
                        .delete({
                            [Op.or]: [
                                { refreshToken: tokenSet.refreshToken },
                                { accessToken: tokenSet.accessToken },
                            ],
                        })
                        .then(() => {
                            throw err;
                        });
                }
                throw err;
            });
    }
}

export default AuthService;
