import { NotMatchedError, DuplicatedEntryError } from '../utils/errors/errors';
import CreatedResultDTO from '../data/dto/CreatedResultDTO';
import UserDTO from '../data/dto/UserDTO';
import SurveyDTO from '../data/dto/SurveyDTO';
import UserInputDTO from '../data/dto/UserInputDTO';

import { logger } from '../modules/winston';

const LOG_TAG: string = '[User/DAO]';

const { sequelize, User } = require('../models');
const { user: MongooseUser } = require('../mongoose_models');

class UserDao {
    /**
     * 유저 생성
     *
     * @param {UserInputDTO} UserInputDTO
     * @return {CreatedResultDTO<UserDTO>} createdResultDTO
     */
    async create(
        userInputDTO: UserInputDTO
    ): Promise<CreatedResultDTO<UserDTO>> {
        logger.debug(`${LOG_TAG} create(userInputDTO = ${userInputDTO})`);
        userInputDTO.accessTime =
            userInputDTO.accessTime || sequelize.literal('CURRENT_TIMESTAMP');
        return User.create({ ...userInputDTO })
            .then((it: UserDTO) => {
                /* TODO Change after apply ts */
                // new CreatedResultDTO<UserDTO></UserDTO>(it.userIdx, new UserDTO(it))
                return new CreatedResultDTO(
                    it.userIdx,
                    UserDTO.createByJson(it)
                );
            })
            .catch((err: Error | any) => {
                if (
                    err.parent.errno === 1062 ||
                    err.parent.code === 'ER_DUP_ENTRY'
                ) {
                    throw new DuplicatedEntryError();
                }
                throw err;
            });
    }

    /**
     * 유저 조회
     *
     * @param {Object} whereObj
     * @returns {Promise<UserDTO>} UserDTO
     */
    async read(where: any) {
        logger.debug(`${LOG_TAG} read(where = ${JSON.stringify(where)})`);
        const result = await User.findOne({ where, nest: true, raw: true });
        if (!result) {
            throw new NotMatchedError();
        }
        return UserDTO.createByJson(result);
    }

    /**
     * 유저 조회
     *
     * @param {number} userIdx
     * @returns {Promise<UserDTO>} UserDTO
     */
    async readByIdx(userIdx: number) {
        logger.debug(`${LOG_TAG} readByIdx(userIdx = ${userIdx})`);
        const result = await User.findByPk(userIdx);
        if (!result) {
            throw new NotMatchedError();
        }
        return UserDTO.createByJson(result.dataValues);
    }

    /**
     * 유저 수정
     *
     * @param {Object} User
     * @return {Promise<number>} affectedRows
     */
    async update(userInputDTO: UserInputDTO): Promise<number> {
        logger.debug(`${LOG_TAG} update(userInputDTO = ${userInputDTO})`);
        const result = await User.update(
            { ...userInputDTO },
            {
                where: { userIdx: userInputDTO.userIdx },
            }
        );
        const affectedRows = result[0];
        if (affectedRows == 0) {
            throw new NotMatchedError();
        }
        return affectedRows;
    }

    /**
     * 유저 access Time 갱신
     *
     * @param {number} userIdx
     * @return {Promise<number>} affectedRows
     */
    async updateAccessTime(userIdx: number) {
        logger.debug(`${LOG_TAG} updateAccessTime(userIdx = ${userIdx})`);
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
    }

    /**
     * 유저 삭제
     *
     * @param {number} userIdx
     * @return {Promise}
     */
    async delete(userIdx: number) {
        logger.debug(`${LOG_TAG} delete(userIdx = ${userIdx})`);
        return User.destroy({ where: { userIdx } });
    }

    /**
     * 서베이 등록
     *
     * @param {SurveyDTO} survey
     * @return {Promise}
     */
    async postSurvey(surveyDTO: SurveyDTO) {
        logger.debug(`${LOG_TAG} postSurvey(surveyDTO = ${surveyDTO})`);
        return MongooseUser.create(surveyDTO).catch((err: any) => {
            if (err.code == 11000) {
                return MongooseUser.updateByPk(surveyDTO.userIdx, {
                    surveyKeywordList: surveyDTO.surveyKeywordList,
                    surveyPerfumeList: surveyDTO.surveyPerfumeList,
                    surveySeriesList: surveyDTO.surveySeriesList,
                });
            }
            throw err;
        });
    }
}

export default UserDao;
