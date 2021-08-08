'use strict';

const {
    TokenGroupDTO,
    UserAuthDTO,
    LoginInfoDTO,
    UserDTO,
} = require('../../data/dto');

exports.createUser = async ({}) => {
    return new TokenGroupDTO({
        userIdx: 1,
        token: 'token',
        refreshToken: 'refreshToken',
    });
};

exports.deleteUser = async () => {
    return 1;
};

exports.getUserByIdx = async (userIdx) => {
    return new UserDTO({
        userIdx: 1,
        nickname: 'user1',
        password: 'test',
        gender: 2,
        email: 'email1@afume.com',
        birth: 1995,
        grade: 1,
        accessTime: '2021-07-13T11:33:49.000Z',
        createdAt: '2021-07-13T11:33:49.000Z',
        updatedAt: '2021-08-07T09:20:29.000Z',
    });
};

exports.authUser = async () => {
    return new UserAuthDTO({ isAuth: false, isAdmin: false });
};

exports.loginUser = async (email, password) => {
    return new LoginInfoDTO({
        userIdx: 1,
        nickname: 'user1',
        gender: 2,
        email: 'email1@afume.com',
        birth: 1995,
        token: 'token',
        refreshToken: 'refreshToken',
    });
};

exports.logoutUser = async () => {
    throw 'Not Implemented';
};

exports.updateUser = async ({}) => {
    return new UserDTO({
        userIdx: 1,
        nickname: 'user1',
        password: 'test',
        gender: 2,
        email: 'email1@afume.com',
        birth: 1995,
        grade: 1,
        accessTime: '2021-07-13T11:33:49.000Z',
        createdAt: '2021-07-13T11:33:49.000Z',
        updatedAt: '2021-08-07T09:20:29.000Z',
    });
};

exports.changePassword = async ({}) => {
    return 1;
};

exports.validateEmail = async (email) => {
    if (email && email != 'duplicate') return true;
    else return false;
};

exports.validateName = async (nickname) => {
    if (nickname && nickname != 'duplicate') return true;
    else return false;
};

exports.addSurvey = async (
    userIdx,
    keywordIdxList,
    perfumeIdxList,
    seriesIdxList
) => {
    throw {};
};
