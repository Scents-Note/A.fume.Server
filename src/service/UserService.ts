import {
    WrongPasswordError,
    PasswordPolicyError,
    NotMatchedError,
} from '../utils/errors/errors';
import UserDao from '../dao/UserDao';
import { encrypt, decrypt } from '../lib/crypto';
import JwtController from '../lib/JwtController';
import TokenPayloadDTO from '../data/dto/TokenPayloadDTO';
import LoginInfoDTO from '../data/dto/LoginInfoDTO';
import TokenGroupDTO from '../data/dto/TokenGroupDTO';
import UserAuthDTO from '../data/dto/UserAuthDTO';
import UserDTO from '../data/dto/UserDTO';
import UserInputDTO from '../data/dto/UserInputDTO';

class UserService {
    userDao: any;
    crypto: any;
    jwt: any;
    constructor(userDao?: any, crypto?: any, jwt?: any) {
        this.userDao = userDao || new UserDao();
        this.crypto = crypto || { encrypt, decrypt };
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
     * @returns {Promise}
     **/
    async createUser(userInputDTO: UserInputDTO) {
        userInputDTO.password = this.crypto.encrypt(userInputDTO.password);
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
            });
    }

    /**
     * 회원 탈퇴
     *
     * @param {number} userIdx
     * @returns {Promise}
     */
    deleteUser(userIdx: number) {
        return this.userDao.delete(userIdx);
    }

    /**
     * 유저 조회
     *
     * @param {number} userIdx
     * @returns {Promise<UserDTO>}
     **/
    async getUserByIdx(userIdx: number): Promise<UserDTO> {
        return this.userDao.readByIdx(userIdx);
    }

    /**
     * 유저 권한 조회
     *
     * @param {string} token
     * @returns {Promise<UserAuthDTO>}
     **/
    async authUser(token: string): Promise<UserAuthDTO> {
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
     **/
    async loginUser(email: string, password: string): Promise<LoginInfoDTO> {
        const user: UserDTO = await this.userDao.read({ email });
        if (this.crypto.decrypt(user.password) != password) {
            throw new WrongPasswordError();
        }
        this.userDao.updateAccessTime(user.userIdx);
        const { token, refreshToken } = this.jwt.publish(
            TokenPayloadDTO.createByJson(user)
        );
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
     **/
    async updateUser(userInputDTO: UserInputDTO): Promise<UserDTO> {
        await this.userDao.update(userInputDTO);
        const user: UserDTO = await this.userDao.readByIdx(
            userInputDTO.userIdx
        );
        return UserDTO.createByJson(user);
    }

    /**
     * 유저 비밀번호 변경
     *
     * @param {number} userIdx
     * @param {string} prevPassword
     * @param {string} newPassword
     * @returns {}
     **/
    async changePassword(
        userIdx: number,
        prevPassword: string,
        newPassword: string
    ) {
        const user = await this.userDao.readByIdx(userIdx);
        const dbPassword = this.crypto.decrypt(user.password);
        if (dbPassword !== prevPassword) {
            throw new WrongPasswordError();
        }
        if (dbPassword === newPassword) {
            throw new PasswordPolicyError();
        }
        const password = this.crypto.encrypt(newPassword);
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
    async validateEmail(email: string): Promise<Boolean> {
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
    async validateName(nickname: string): Promise<Boolean> {
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
     * @param {number} userIdx
     * @param {number[]} keywordIdxList
     * @param {number[]} perfumeIdxList
     * @param {number[]} seriesIdxList
     * @returns {boolean}
     **/
    async addSurvey(
        userIdx: number,
        keywordIdxList: number[],
        perfumeIdxList: number[],
        seriesIdxList: number[]
    ) {
        return this.userDao.postSurvey(
            userIdx,
            keywordIdxList,
            perfumeIdxList,
            seriesIdxList
        );
    }
}

export default UserService;
