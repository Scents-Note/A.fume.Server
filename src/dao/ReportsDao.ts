import { logger } from '@modules/winston';

import { NotMatchedError } from '@errors';

import { ReportUserInquirePerfumeDTO } from '@dto/index';

const LOG_TAG: string = '[SearchHistory/DAO]';

const { ReportUserInquirePerfume } = require('@sequelize');

class ReportsDao {
    /**
     * 향수 조회 기록 조회
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @return {Promise<ReportUserInquirePerfumeDTO>}
     * @throws {NotMatchedError} if there is no SearchHistory
     */
    async readUserInquirePerfume(
        userIdx: number,
        perfumeIdx: number
    ): Promise<ReportUserInquirePerfumeDTO> {
        logger.debug(
            `${LOG_TAG} readUserInquirePerfume(userIdx = ${userIdx}, perfumeIdx = ${perfumeIdx})`
        );
        // return ReportUserInquirePerfume.findOne({
        //     where: { userIdx, perfumeIdx },
        //     raw: true,
        //     nest: true,
        // }).then((it: any) => {
        //     if (it == null) {
        //         throw new NotMatchedError();
        //     }
        //     return ReportUserInquirePerfumeDTO.createByJson(it);
        // });

        const it = await ReportUserInquirePerfume.findOne({
            where: { userIdx, perfumeIdx },
            raw: true,
            nest: true,
        });

        if (it == null) {
            throw new NotMatchedError();
        }
        return ReportUserInquirePerfumeDTO.createByJson(it);
    }

    /**
     * 향수 조회 기록 생성
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @return {Promise}
     */
    async createUserInquirePerfume(
        userIdx: number,
        perfumeIdx: number,
        count: number
    ): Promise<ReportUserInquirePerfumeDTO> {
        logger.debug(
            `${LOG_TAG} createUserInquirePerfume(userIdx = ${userIdx}, perfumeIdx = ${perfumeIdx}, count = ${count})`
        );
        return ReportUserInquirePerfume.create(
            { userIdx, perfumeIdx, count },
            { raw: true, nest: true }
        )
            .then((result: any) => {
                return result.dataValues;
            })
            .then(ReportUserInquirePerfumeDTO.createByJson);
    }

    /**
     * 향수 조회 기록 업데이트
     *
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @param {number} count
     * @return {Promise<number>} affectedRows
     * @throws {NotMatchedError} if there is no SearchHistory
     */
    async updateUserInquirePerfume(
        userIdx: number,
        perfumeIdx: number,
        count: number
    ): Promise<number> {
        logger.debug(
            `${LOG_TAG} updateUserInquirePerfume(userIdx = ${userIdx}, perfumeIdx = ${perfumeIdx}, count = ${count})`
        );
        const [affectedRows]: [number] = await ReportUserInquirePerfume.update(
            { count },
            { where: { userIdx, perfumeIdx } }
        );
        if (affectedRows == 0) {
            throw new NotMatchedError();
        }
        return affectedRows;
    }

    /**
     * SearchHistory 대용량 삽입
     * @return {Promise}
     */
    async bulkInsertUserInquirePerfume(
        searchHistories: ReportUserInquirePerfumeDTO[],
        transaction?: any
    ): Promise<void> {
        logger.debug(
            `${LOG_TAG} bulkInsertUserInquirePerfume(searchHistories: ${searchHistories}, transaction: ${transaction})`
        );
        const result = ReportUserInquirePerfume.bulkCreate(searchHistories, {
            transaction,
        });
        return result;
    }

    /**
     * SearchHistory 초기화
     */
    async clearUserInquirePerfume(transaction?: any): Promise<void> {
        logger.debug(
            `${LOG_TAG} clearUserInquirePerfume(transaction: ${transaction})`
        );
        await ReportUserInquirePerfume.destroy({ where: {}, transaction });
        return;
    }
}

export default ReportsDao;
