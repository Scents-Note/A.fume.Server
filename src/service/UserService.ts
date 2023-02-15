import { logger } from '@modules/winston';

import {
    WrongPasswordError,
    PasswordPolicyError,
    NotMatchedError,
    DuplicatedEntryError,
    FailedToCreateError,
} from '@errors';

import UserDao from '@dao/UserDao';
import { TokenDao, TokenDaoSequelize } from '@dao/TokenDao';

import { encrypt as _encrypt, decrypt as _decrypt } from '@libs/crypto';
import JwtController from '@libs/JwtController';

import {
    TokenPayloadDTO,
    LoginInfoDTO,
    TokenGroupDTO,
    UserAuthDTO,
    UserInputDTO,
    UserDTO,
    SurveyDTO,
    TokenSetDTO,
} from '@dto/index';

const LOG_TAG: string = '[User/Service]';

class UserService {
    userDao: UserDao;
    tokenDao: TokenDao;
    crypto: any;
    jwt: any;
    constructor(
        userDao?: UserDao,
        tokenDao?: TokenDao,
        crypto?: any,
        jwt?: any
    ) {
        this.userDao = userDao || new UserDao();
        this.tokenDao = tokenDao || new TokenDaoSequelize();
        this.crypto = crypto || { encrypt: _encrypt, decrypt: _decrypt };
        this.jwt = jwt || {
            create: JwtController.create,
            publish: JwtController.publish,
            verify: JwtController.verify,
        };
    }

    /**
     * 유저 회원 가입
     *
     * @param {UserInputDTO} UserInputDTO
     * @returns {Promise<TokenGroupDTO>}
     * @throws {FailedToCreateError} if failed to create user
     **/
    async createUser(userInputDTO: UserInputDTO): Promise<TokenGroupDTO> {
        logger.debug(`${LOG_TAG} createUser(userInputDTO = ${userInputDTO})`);
        return this.userDao
            .create(userInputDTO)
            .then(() => {
                return this.userDao.read({ email: userInputDTO.email });
            })
            .then((user: UserDTO | any) => {
                delete user.password;
                const payload = Object.assign({}, user);

                const { userIdx } = user;
                const { token, refreshToken } = this.jwt.publish(payload);
                return TokenGroupDTO.createByJSON({
                    userIdx,
                    token,
                    refreshToken,
                });
            })
            .catch((error: Error) => {
                if (error instanceof DuplicatedEntryError) {
                    logger.debug(
                        `${LOG_TAG} createUser() occurs FailedToCreateError ` +
                            error.stack
                    );
                    throw new FailedToCreateError();
                }
                throw error;
            });
    }

    /**
     * 회원 탈퇴
     *
     * @param {number} userIdx
     * @returns {Promise}
     */
    deleteUser(userIdx: number) {
        logger.debug(`${LOG_TAG} deleteUser(userIdx = ${userIdx})`);
        return this.userDao.delete(userIdx);
    }

    /**
     * 유저 조회
     *
     * @param {number} userIdx
     * @returns {Promise<UserDTO>}
     * @throws {NotMatchedError} if there is no user
     **/
    async getUserByIdx(userIdx: number): Promise<UserDTO> {
        logger.debug(`${LOG_TAG} getUserByIdx(userIdx = ${userIdx})`);
        return this.userDao.readByIdx(userIdx);
    }

    /**
     * 유저 권한 조회
     *
     * @param {string} token
     * @returns {Promise<UserAuthDTO>}
     **/
    async authUser(token: string): Promise<UserAuthDTO> {
        logger.debug(`${LOG_TAG} authUser(token = ${token})`);
        return new Promise((resolve, _) => {
            try {
                const payload: any = this.jwt.verify(token);
                this.userDao
                    .readByIdx(payload.userIdx)
                    .then((user: UserDTO) => {
                        resolve(UserAuthDTO.create(user));
                    })
                    .catch(() => {
                        resolve(new UserAuthDTO(false, false));
                    });
            } catch (err: Error | any) {
                resolve(new UserAuthDTO(false, false));
            }
        });
    }

    /**
     * @typedef LoginToken
     * @property {string} token 로그인 토큰
     * @property {string} refreshToken 토큰 갱신을 위한 토큰
     */

    /**
     * 로그인
     *
     * @param {string} email
     * @param {string} password
     * @returns {LoginInfoDTO} - 토큰 정보
     * @throws {WrongPasswordError} if password is invalid
     * @throws {NotMatchedError} if there is no user
     **/
    async loginUser(
        email: string,
        encryptPassword: string
    ): Promise<LoginInfoDTO> {
        logger.debug(
            `${LOG_TAG} loginUser(email = ${email}, encrypt_password = ${encryptPassword})`
        );
        const user: UserDTO = await this.userDao.read({ email });
        if (
            this.crypto.decrypt(user.password) !=
            this.crypto.decrypt(encryptPassword)
        ) {
            throw new WrongPasswordError();
        }
        this.userDao.updateAccessTime(user.userIdx);

        const payload: any = TokenPayloadDTO.createByJson(user);

        const { token, refreshToken } = this.jwt.publish(payload);
        await this.tokenDao
            .create(new TokenSetDTO(token, refreshToken))
            .then((result: boolean) => {
                if (!result) {
                    logger.error('Failed to create tokenset on storage');
                }
            })
            .catch((err: Error) => {
                logger.error(err);
            });
        return LoginInfoDTO.createByJson(
            Object.assign({}, user, {
                token,
                refreshToken,
            })
        );
    }

    /**
     * 로그아웃
     *
     * @returns
     **/
    logoutUser() {
        throw 'Not Implemented';
    }

    /**
     * 유저 정보 수정
     *
     * @param {UserInputDTO} UserInputDTO
     * @returns {UserDTO} UserDTO
     * @throws {NotMatchedError} if there is no User
     **/
    async updateUser(userInputDTO: UserInputDTO): Promise<UserDTO> {
        logger.debug(`${LOG_TAG} authUser(userInputDTO = ${userInputDTO})`);
        await this.userDao.update(userInputDTO);
        const user: UserDTO = await this.userDao.readByIdx(
            userInputDTO.userIdx!!
        );
        return UserDTO.createByJson(user);
    }

    /**
     * 유저 비밀번호 확인
     *
     * @param {number} userIdx
     * @param {string} encryptPassword
     * @returns {Promise<boolean>} true if password is correct
     * @throws {WrongPasswordError} if password is wrong
     * @throws {NotMatchedError} if there is no User
     **/
    async checkPassword(
        userIdx: number,
        encryptPassword: string
    ): Promise<boolean> {
        logger.debug(
            `${LOG_TAG} checkPassword(userIdx = ${userIdx}, password = ${encryptPassword})`
        );
        const user: UserDTO = await this.userDao.readByIdx(userIdx);
        if (
            this.crypto.decrypt(user.password) !=
            this.crypto.decrypt(encryptPassword)
        ) {
            return false;
        }
        return true;
    }

    /**
     * 유저 비밀번호 변경
     *
     * @param {number} userIdx
     * @param {string} encryptPrevPassword
     * @param {string} encryptNewPassword
     * @returns {Promise<number>} affected rows
     * @throws {WrongPasswordError} if password is wrong
     * @throws {PasswordPolicyError} if new password is same with previous password
     * @throws {NotMatchedError} if there is no User
     **/
    async changePassword(
        userIdx: number,
        encryptPrevPassword: string,
        encryptNewPassword: string
    ): Promise<number> {
        logger.debug(
            `${LOG_TAG} authUser(userIdx = ${userIdx}, encrypt = ${encryptPrevPassword}, newPassword = ${encryptNewPassword})`
        );
        const user: UserDTO = await this.userDao.readByIdx(userIdx);
        if (
            this.crypto.decrypt(user.password) !=
            this.crypto.decrypt(encryptPrevPassword)
        ) {
            throw new WrongPasswordError();
        }
        if (
            this.crypto.decrypt(encryptPrevPassword) ==
            this.crypto.decrypt(encryptNewPassword)
        ) {
            throw new PasswordPolicyError();
        }
        const password: string = encryptNewPassword;
        return this.userDao.update({
            userIdx,
            password,
        });
    }

    /**
     * Email 중복 체크
     *
     * @param {string} Email
     * @returns {boolean}
     **/
    async validateEmail(email: string): Promise<boolean> {
        logger.debug(`${LOG_TAG} validateEmail(email = ${email})`);
        try {
            await this.userDao.read({ email });
            return false;
        } catch (err) {
            if (err instanceof NotMatchedError) {
                return true;
            }
            throw err;
        }
    }

    /**
     * Name 중복 체크
     *
     * @param {string} nickname
     * @returns {boolean}
     **/
    async validateName(nickname: string): Promise<boolean> {
        logger.debug(`${LOG_TAG} validateName(nickname = ${nickname})`);
        try {
            await this.userDao.read({ nickname });
            return false;
        } catch (err) {
            if (err instanceof NotMatchedError) {
                return true;
            }
            throw err;
        }
    }

    /**
     * 서베이 등록
     *
     * @param {surveyDTO} surveyDTO
     * @returns {boolean}
     **/
    async addSurvey(surveyDTO: SurveyDTO) {
        logger.debug(`${LOG_TAG} addSurvey(surveyDTO = ${surveyDTO})`);
        return this.userDao.postSurvey(surveyDTO);
    }
}

export default UserService;
