import { logger } from '@modules/winston';

import { NotMatchedError } from '@errors';

import { SearchHistoryDTO } from '@dto/index';

const LOG_TAG: string = '[SearchHistory/DAO]';

const { SearchHistory } = require('@sequelize');

class SearchHistoryDao {
    /**
     * 향수 조회 기록 조회
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @return {Promise<SearchHistoryDTO>}
     * @throws {NotMatchedError} if there is no matched item.
     */
    async read(userIdx: number, perfumeIdx: number): Promise<SearchHistoryDTO> {
        logger.debug(
            `${LOG_TAG} read(userIdx = ${userIdx}, perfumeIdx = ${perfumeIdx})`
        );
        return SearchHistory.findOne({
            where: { userIdx, perfumeIdx },
            raw: true,
            nest: true,
        }).then((it: any) => {
            if (it == null) {
                throw new NotMatchedError();
            }
            return SearchHistoryDTO.createByJson(it);
        });
    }

    /**
     * 향수 조회 기록 생성
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @return {Promise}
     */
    async create(
        userIdx: number,
        perfumeIdx: number,
        count: number
    ): Promise<SearchHistoryDTO> {
        logger.debug(
            `${LOG_TAG} create(userIdx = ${userIdx}, perfumeIdx = ${perfumeIdx}, count = ${count})`
        );
        return SearchHistory.create(
            { userIdx, perfumeIdx, count },
            { raw: true, nest: true }
        )
            .then((result: any) => {
                return result.dataValues;
            })
            .then(SearchHistoryDTO.createByJson);
    }

    /**
     * 향수 조회 기록 업데이트
     *
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @param {number} count
     * @return {Promise<number>} affectedRows
     */
    async update(
        userIdx: number,
        perfumeIdx: number,
        count: number
    ): Promise<number> {
        logger.debug(
            `${LOG_TAG} update(userIdx = ${userIdx}, perfumeIdx = ${perfumeIdx}, count = ${count})`
        );
        const [affectedRows]: [number] = await SearchHistory.update(
            { count },
            { where: { userIdx, perfumeIdx } }
        );
        if (affectedRows == 0) {
            throw new NotMatchedError();
        }
        return affectedRows;
    }
}

export default SearchHistoryDao;
