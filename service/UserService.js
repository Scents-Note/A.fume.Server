'use strict';

const jwt = require('../lib/token.js');
const crypto = require('../lib/crypto.js');
const userDao = require('../dao/UserDao.js');
const { WrongPasswordError } = require('../utils/errors/errors.js');

/**
 * 유저 회원 가입
 *
 * body User Created user object
 * no response value expected for this operation
 **/
exports.createUser = ({id, nickname, password, gender, phone, email, birth}) => {
  password = crypto.encrypt(password);
  return userDao.create({id, nickname, password, gender, phone, email, birth});
}


/**
 * 회원 탈퇴
 * This can only be done by the logged in user.
 *
 * userIdx String The Idx that needs to be deleted
 * no response value expected for this operation
 **/
exports.deleteUser = (userIdx) => {
  return userDao.delete(userIdx);
}


/**
 * Get user by user idx
 * 
 *
 * userIdx Long 유저 ID
 * returns User
 **/
exports.getUserByIdx = async (userIdx) => {
  const result = await userDao.readByIdx(userIdx)
  delete result.password;
  return result;
}


/**
 * Logs user into the system
 * 
 *
 * nickname String The user name for login
 * password String The password for login in clear text
 * returns String
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
 * 로그아웃 한다.
 * 발행된 토큰을 무효화 시킨다.
 * 
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

