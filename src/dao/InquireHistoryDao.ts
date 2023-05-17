import { logger } from '@modules/winston';
import { InquireHistoryDTO } from '@src/data/dto/InquireHistoryDTO';

const LOG_TAG: string = '[SearchHistory/DAO]';

const { InquireHistory } = require('@sequelize');

class InquireHistoryDao {
    /**
     * 향수 조회 기록 생성
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @return {Promise}
     */
    async create(
        userIdx: number,
        perfumeIdx: number,
        routes: string
    ): Promise<boolean> {
        logger.debug(
            `${LOG_TAG} create(userIdx = ${userIdx}, perfumeIdx = ${perfumeIdx}, routes = ${routes})`
        );
        // return InquireHistory.create(
        //     { userIdx, perfumeIdx, routes },
        //     { raw: true, nest: true }
        // )
        //     .then((_: any) => {
        //         return true;
        //     })
        //     .catch((_: Error) => {
        //         return false;
        //     });
        try {
            await InquireHistory.create(
                { userIdx, perfumeIdx, routes },
                { raw: true, nest: true }
            );
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 향수 조회 기록 조회
     * @param {[key: string]: string} whereCondition
     * @return {Promise<InquireHistoryDTO[]>}
     */
    async findAll(
        whereCondition: {
            [key: string]: string;
        } = {}
    ): Promise<InquireHistoryDTO[]> {
        logger.debug(
            `${LOG_TAG} read(where = ${JSON.stringify(whereCondition)})`
        );
        // return InquireHistory.findAll({
        //     where: whereCondition,
        //     raw: true,
        //     nest: true,
        // }).then((rows: any[]) => {
        //     return rows.map(InquireHistoryDTO.createByJson);
        // });
        try {
            const rows = await InquireHistory.findAll({
                where: whereCondition,
                raw: true,
                nest: true,
            });
            return rows.map((row: any) => InquireHistoryDTO.createByJson(row));
        } catch (error) {
            throw error;
        }
    }
}

export default InquireHistoryDao;
