import { logger } from '@modules/winston';

import { TokenSetDTO } from '@src/data/dto';

// TODO it shoould be changed to memory-db
const { Token } = require('@sequelize');

const LOG_TAG: string = '[Token/DAO]';

interface TokenDao {
    /**
     * 토큰 조회
     *
     * @param {Object} where
     * @returns {Promise<Note[]>}
     */
    read(accessToken: string): Promise<TokenSetDTO | null>;

    /**
     * 토큰 기록 생성
     *
     * @param {Object} where
     * @returns {Promise<Note[]>}
     */
    create(tokenSet: TokenSetDTO): Promise<boolean>;

    /**
     * 토큰 갱신
     *
     * @param {Object} where
     * @returns {Promise<Note[]>}
     */
    update(prevAccessToken: string, newAccessToken: string): Promise<boolean>;

    /**
     * 토큰 정보 삭제
     *
     * @param {Object} condition
     * @returns {Promise<Note[]>}
     */
    delete(condition: any): Promise<boolean>;
}

class TokenDaoSequelize implements TokenDao {
    read(accessToken: string): Promise<TokenSetDTO | null> {
        logger.debug(`${LOG_TAG} read(accessToken = ${accessToken}})`);

        return Token.findOne({
            where: {
                accessToken,
            },
            nest: true,
            raw: true,
        }).then((it: any) => {
            if (!it) {
                return null;
            }
            return new TokenSetDTO(it.accessToken, it.refreshToken);
        });
    }

    create(tokenSet: TokenSetDTO): Promise<boolean> {
        logger.debug(`${LOG_TAG} read(tokenSet = ${tokenSet})`);

        return Token.create({
            accessToken: tokenSet.accessToken,
            refreshToken: tokenSet.refreshToken,
        }).then((it: any) => {
            if (!it) {
                return false;
            }
            return true;
        });
    }

    update(prevAccessToken: string, newAccessToken: string): Promise<boolean> {
        logger.debug(
            `${LOG_TAG} read(prevAccessToken = ${prevAccessToken}, newAccessToken = ${newAccessToken}})`
        );

        return Token.update(
            { accessToken: newAccessToken },
            {
                where: {
                    accessToken: prevAccessToken,
                },
                nest: true,
                raw: true,
            }
        ).then((it: any) => {
            if (!it || it[0] == 0) {
                return false;
            }
            return true;
        });
    }

    delete(condition: any): Promise<boolean> {
        logger.debug(
            `${LOG_TAG} read(condition = ${JSON.stringify(condition)})`
        );

        return Token.destroy({
            where: condition,
        }).then((it: any) => {
            if (!it || it[0] == 0) {
                return false;
            }
            return true;
        });
    }
}

export { TokenDaoSequelize, TokenDao };
