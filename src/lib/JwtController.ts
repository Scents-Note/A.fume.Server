import jwt from 'jsonwebtoken';
import { ExpiredTokenError, InvalidTokenError } from '../utils/errors/errors';
import TokenPayloadDTO from '../data/dto/TokenPayloadDTO';

const jwtSecret: jwt.Secret = process.env.JWT_SECRET || 'secretKey';

const options: jwt.SignOptions = {
    expiresIn: '20d',
    issuer: 'afume-jackpot',
};

const refreshOptions: jwt.SignOptions = {
    expiresIn: '20d',
    issuer: 'afume-jackpot',
};

/**
 * @typedef LoginToken
 * @param {string} token
 * @param {string} refreshToken
 */

class JwtController {
    private constructor() {}
    /**
     * JWT 토큰 발행
     *
     * @param {any} payload
     * @returns {LoginToken}
     */
    static publish(payload: TokenPayloadDTO) {
        const json: string = JSON.parse(JSON.stringify(payload));
        const token: string = jwt.sign(json, jwtSecret, options);
        const refreshToken: any = jwt.sign(
            {
                refreshToken: payload,
            },
            jwtSecret,
            refreshOptions
        );
        return {
            token,
            refreshToken,
        };
    }

    /**
     * JWT 토큰 생성
     *
     * @param {TokenPayloadDTO} payload
     * @returns {string} token
     */
    static create(payload: TokenPayloadDTO) {
        return jwt.sign({ ...payload }, jwtSecret, options);
    }

    /**
     * JWT 토큰 검증
     *
     * @param {string} token
     * @returns {TokenPayloadDTO} payload
     */
    static verify(token: string) {
        try {
            return TokenPayloadDTO.createByJson(jwt.verify(token, jwtSecret));
        } catch (err: Error | any) {
            if (err && err.message === 'jwt expired') {
                throw new ExpiredTokenError();
            }
            if (err && err.message === 'invalid signature') {
                throw new InvalidTokenError();
            }
            throw err;
        }
    }

    /**
     * JWT 토큰 재발행
     *
     * @param {string} refreshToken
     * @returns {string} token
     */
    static reissue(refreshToken: string) {
        const result: any = jwt.verify(refreshToken, jwtSecret);
        return jwt.sign(result.refreshToken, jwtSecret, options);
    }
}
export default JwtController;
