import { CreatedResultDTO, UserDTO } from '@dto/index';

module.exports.create = async ({
    nickname,
    password,
    gender,
    email,
    birth,
    grade,
    accessTime,
}) => {
    return new CreatedResultDTO(
        94,
        UserDTO.createByJson({
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
        })
    );
};

module.exports.read = async (where) => {
    return UserDTO.createByJson({
        userIdx: 1,
        nickname: 'user1',
        password: 'encrypted',
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
    return UserDTO.createByJson({
        userIdx,
        nickname: 'user1',
        password: 'encrypted',
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
