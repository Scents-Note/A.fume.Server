'use strict';

const jwt = require('../lib/token.js');
const crypto = require('../lib/crypto.js');
const userDao = require('../dao/UserDao.js');
const {
    WrongPasswordError,
    NotMatchedError,
} = require('../utils/errors/errors.js');
const user = require('../mongoose_models/user.js');

/**
 * 유저 회원 가입
 *
 * @param {Object} User
 * @returns {Promise}
 **/
exports.createUser = ({
    id,
    nickname,
    password,
    gender,
    phone,
    email,
    birth,
    grade,
}) => {
    password = crypto.encrypt(password);
    return userDao.create({
        id,
        nickname,
        password,
        gender,
        phone,
        email,
        birth,
        grade,
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
exports.getUserByIdx = async (userIdx) => {
    const result = await userDao.readByIdx(userIdx);
    delete result.password;
    return result;
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
                    resolve(
                        Object.assign(
                            { isAuth: true, isAdmin: user.grade >= 1 },
                            user
                        )
                    );
                })
                .catch((err) => {
                    resolve({ isAuth: false, isAdmin: false });
                });
        } catch (err) {
            resolve({ isAuth: false, isAdmin: false });
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
 * @returns {Promise<LoginToken>} - 토큰 정보
 **/
exports.loginUser = async (email, password) => {
    const user = await userDao.read({ email });
    if (crypto.decrypt(user.password) != password) {
        throw new WrongPasswordError();
    }
    delete user.password;
    const payload = Object.assign({}, user);
    userDao.updateAccessTime(user.userIdx);
    return Object.assign({ userIdx: user.userIdx }, jwt.publish(payload));
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
 * @returns {}
 **/
exports.updateUser = ({
    userIdx,
    nickname,
    password,
    gender,
    phone,
    email,
    birth,
    grade,
}) => {
    return userDao.update({
        userIdx,
        nickname,
        password,
        gender,
        phone,
        email,
        birth,
        grade,
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
