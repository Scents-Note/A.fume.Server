import {
    WrongPasswordError,
    PasswordPolicyError,
    NotMatchedError,
} from '../utils/errors/errors';
import { encrypt, decrypt } from '../lib/crypto';
import JwtController from '../lib/JwtController';
import TokenPayloadDTO from '../data/dto/TokenPayloadDTO';
import { GenderMap } from '../utils/enumType';
import LoginInfoDTO from '../data/dto/LoginInfoDTO';
import TokenGroupDTO from '../data/dto/TokenGroupDTO';
import UserAuthDTO from '../data/dto/UserAuthDTO';
import UserDTO from '../data/dto/UserDTO';

let crypto = { encrypt, decrypt };

let userDao = require('../dao/UserDao.js');
let jwt = {
    create: JwtController.create,
    publish: JwtController.publish,
    verify: JwtController.verify,
};

/**
 * 유저 회원 가입
 *
 * @param {UserInputRequestDTO} UserInputRequestDTO
 * @returns {Promise}
 **/
exports.createUser = ({ nickname, password, gender, email, birth, grade }) => {
    password = crypto.encrypt(password);
    return userDao
        .create({
            nickname,
            password,
            gender,
            email,
            birth,
            grade,
        })
        .then(() => {
            return userDao.read({ email: email });
        })
        .then((user) => {
            delete user.password;
            const payload = Object.assign({}, user);
            const { userIdx } = user;
            const { token, refreshToken } = jwt.publish(payload);
            return TokenGroupDTO.createByJSON({ userIdx, token, refreshToken });
        });
};

/**
 * 회원 탈퇴
 *
 * @param {number} userIdx
 * @returns {Promise}
 **/
exports.deleteUser = (userIdx) => {
    return userDao.delete(userIdx);
};

/**
 * 유저 조회
 *
 * @param {number} userIdx
 * @returns {Promise<User>}
 **/
exports.getUserByIdx = (userIdx) => {
    return userDao.readByIdx(userIdx);
};

/**
 * 유저 권한 조회
 *
 * @param {string} token
 * @returns {Promise<User>}
 **/
exports.authUser = (token) => {
    return new Promise((resolve, reject) => {
        try {
            const payload = jwt.verify(token);
            userDao
                .readByIdx(payload.userIdx)
                .then((user) => {
                    delete user.password;
                    resolve(UserAuthDTO.create(user));
                })
                .catch((err) => {
                    resolve(new UserAuthDTO(false, false));
                });
        } catch (err) {
            resolve(new UserAuthDTO(false, false));
        }
    });
};

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
exports.loginUser = async (email, password) => {
    const user = await userDao.read({ email });
    if (crypto.decrypt(user.password) != password) {
        throw new WrongPasswordError();
    }
    userDao.updateAccessTime(user.userIdx);
    const { token, refreshToken } = jwt.publish(
        TokenPayloadDTO.createByJson(user)
    );
    return LoginInfoDTO.createByJson(
        Object.assign({}, user, {
            token,
            refreshToken,
        })
    );
};

/**
 * 로그아웃
 *
 * @returns
 **/
exports.logoutUser = () => {
    throw 'Not Implemented';
};

/**
 * 유저 정보 수정
 *
 * @param {Object} User
 * @returns {UserDTO} UserDTO
 **/
exports.updateUser = async ({
    userIdx,
    nickname,
    gender,
    email,
    birth,
    grade,
}) => {
    gender = GenderMap[gender];
    await userDao.update({
        userIdx,
        nickname,
        gender,
        email,
        birth,
        grade,
    });
    const user = await userDao.readByIdx(userIdx);
    return UserDTO.createByJson(user);
};

/**
 * 유저 비밀번호 변경
 *
 * @param {number} userIdx
 * @param {string} prevPassword
 * @param {string} newPassword
 * @returns {}
 **/
exports.changePassword = async ({ userIdx, prevPassword, newPassword }) => {
    const user = await userDao.readByIdx(userIdx);
    const dbPassword = crypto.decrypt(user.password);
    if (dbPassword !== prevPassword) {
        throw new WrongPasswordError();
    }
    if (dbPassword === newPassword) {
        throw new PasswordPolicyError();
    }
    const password = crypto.encrypt(newPassword);
    return userDao.update({
        userIdx,
        password,
    });
};

/**
 * Email 중복 체크
 *
 * @param {string} Email
 * @returns {boolean}
 **/
exports.validateEmail = async (email) => {
    try {
        await userDao.read({ email });
        return false;
    } catch (err) {
        if (err instanceof NotMatchedError) {
            return true;
        }
        throw err;
    }
};

/**
 * Name 중복 체크
 *
 * @param {string} nickname
 * @returns {boolean}
 **/
exports.validateName = async (nickname) => {
    try {
        await userDao.read({ nickname });
        return false;
    } catch (err) {
        if (err instanceof NotMatchedError) {
            return true;
        }
        throw err;
    }
};

/**
 * 서베이 등록
 *
 * @param {number} userIdx
 * @param {number[]} keywordIdxList
 * @param {number[]} perfumeIdxList
 * @param {number[]} seriesIdxList
 * @returns {boolean}
 **/
exports.addSurvey = async (
    userIdx,
    keywordIdxList,
    perfumeIdxList,
    seriesIdxList
) => {
    return userDao.postSurvey(
        userIdx,
        keywordIdxList,
        perfumeIdxList,
        seriesIdxList
    );
};

module.exports.setUserDao = (dao) => {
    userDao = dao;
};
module.exports.setCrypto = (_crypto) => {
    crypto = _crypto;
};
module.exports.setJwt = (_jwt) => {
    jwt = _jwt;
};
