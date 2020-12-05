'use strict';

const jwt = require('../lib/token.js');
const crypto = require('../lib/crypto.js');
const userDao = require('../dao/UserDao.js');
const { WrongPasswordError } = require('../utils/errors/errors.js');

/**
 * 유저 회원 가입
 *
 * @param {Object} User
 * @returns {Promise}
 **/
exports.createUser = ({id, nickname, password, gender, phone, email, birth}) => {
  password = crypto.encrypt(password);
  return userDao.create({id, nickname, password, gender, phone, email, birth});
}


/**
 * 회원 탈퇴
 *
 * @param {number} userIdx
 * @returns {Promise}
 **/
exports.deleteUser = (userIdx) => {
  return userDao.delete(userIdx);
}


/**
 * 유저 조회
 *
 * @param {number} userIdx
 * @returns {Promise<User>}
 **/
exports.getUserByIdx = async (userIdx) => {
  const result = await userDao.readByIdx(userIdx)
  delete result.password;
  return result;
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
 * @returns {Promise<LoginToken>} - 토큰 정보
 **/
exports.loginUser = async (email,password) => {
  const user = await userDao.readByEmail(email);
  if(crypto.decrypt(user.password) != password) {
    throw new WrongPasswordError();
  }
  delete user.password;
  const payload = Object.assign({}, user);
  return jwt.publish(payload);
}


/**
 * 로그아웃
 * 
 * @returns
 **/
exports.logoutUser = () => {
  throw "Not Implemented";
}


/**
 * Updated user
 * This can only be done by the logged in user.
 *
 * userIdx String name that need to be updated
 * body User Updated user object
 * no response value expected for this operation
 **/
exports.updateUser = ({userIdx, nickname, password, gender, phone, email, birth}) => {
  return userDao.update({userIdx, nickname, password, gender, phone, email, birth})
}

