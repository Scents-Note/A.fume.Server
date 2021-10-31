const {
    NotMatchedError,
    DuplicatedEntryError,
} = require('../utils/errors/errors.js');

const { sequelize, User } = require('../models');
const { user: MongooseUser } = require('../mongoose_models');

const { UserDTO, CreatedResultDTO } = require('../data/dto');

/**
 * 유저 생성
 *
 * @param {Object} User
 * @return {CreatedResultDTO<UserDTO>} createdResultDTO
 */
module.exports.create = ({
    nickname,
    password,
    gender,
    email,
    birth,
    grade,
    accessTime,
}) => {
    accessTime = accessTime || sequelize.literal('CURRENT_TIMESTAMP');
    return User.create({
        nickname,
        password,
        gender,
        email,
        birth,
        grade,
        accessTime,
    })
        .then((it) => {
            return new CreatedResultDTO({
                idx: it.userIdx,
                created: new UserDTO(it),
            });
        })
        .catch((err) => {
            if (
                err.parent.errno === 1062 ||
                err.parent.code === 'ER_DUP_ENTRY'
            ) {
                throw new DuplicatedEntryError();
            }
            throw err;
        });
};

/**
 * 유저 조회
 *
 * @param {Object} whereObj
 * @returns {Promise<UserDTO>} UserDTO
 */
module.exports.read = async (where) => {
    const result = await User.findOne({ where, nest: true, raw: true });
    if (!result) {
        throw new NotMatchedError();
    }
    return new UserDTO(result);
};

/**
 * 유저 조회
 *
 * @param {number} userIdx
 * @returns {Promise<UserDTO>} UserDTO
 */
module.exports.readByIdx = async (userIdx) => {
    const result = await User.findByPk(userIdx);
    if (!result) {
        throw new NotMatchedError();
    }
    return new UserDTO(result.dataValues);
};

/**
 * 유저 수정
 *
 * @param {Object} User
 * @return {Promise<number>} affectedRows
 */
module.exports.update = async ({
    userIdx,
    nickname,
    password,
    gender,
    birth,
    email,
    grade,
}) => {
    const result = await User.update(
        { nickname, password, gender, email, birth, grade },
        { where: { userIdx } }
    );
    const affectedRows = result[0];
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};

/**
 * 유저 access Time 갱신
 *
 * @param {number} userIdx
 * @return {Promise<number>} affectedRows
 */
module.exports.updateAccessTime = async (userIdx) => {
    const accessTime = sequelize.literal('CURRENT_TIMESTAMP');
    const result = await User.update(
        { accessTime },
        { where: { userIdx }, silent: true }
    );
    const affectedRows = result[0];
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};

/**
 * 유저 삭제
 *
 * @param {number} userIdx
 * @return {Promise}
 */
module.exports.delete = (userIdx) => {
    return User.destroy({ where: { userIdx } });
};

/**
 * 서베이 등록
 *
 * @param {SurveyDTO} survey
 * @return {Promise}
 */
module.exports.postSurvey = ({
    userIdx,
    surveyKeywordList,
    surveyPerfumeList,
    surveySeriesList,
}) => {
    return MongooseUser.create({
        userIdx,
        surveyKeywordList,
        surveyPerfumeList,
        surveySeriesList,
    }).catch((err) => {
        if (err.code == 11000) {
            return MongooseUser.updateByPk(userIdx, {
                surveyKeywordList,
                surveyPerfumeList,
                surveySeriesList,
            });
        }
        throw err;
    });
};
