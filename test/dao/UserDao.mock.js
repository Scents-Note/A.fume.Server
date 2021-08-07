const { UserDTO, CreatedResultDTO } = require('../../data/dto');

module.exports.create = async ({
    nickname,
    password,
    gender,
    email,
    birth,
    grade,
    accessTime,
}) => {
    return new CreatedResultDTO({
        idx: 94,
        created: new UserDTO({
            userIdx: 1,
            nickname,
            password,
            gender,
            email,
            birth,
            grade,
            accessTime,
            createdAt: '2021-07-13T11:33:49.000Z',
            updatedAt: '2021-08-07T09:20:29.000Z',
        }),
    });
};

module.exports.read = async (where) => {
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

module.exports.readByIdx = async (userIdx) => {
    return new UserDTO({
        userIdx,
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

module.exports.update = async ({}) => {
    return 1;
};

module.exports.updateAccessTime = async () => {
    return 1;
};

module.exports.delete = () => {
    return 1;
};

module.exports.postSurvey = ({}) => {
    return undefined;
};
