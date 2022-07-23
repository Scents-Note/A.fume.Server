import { logger } from '@modules/winston';

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
        return InquireHistory.create(
            { userIdx, perfumeIdx, routes },
            { raw: true, nest: true }
        )
            .then((_: any) => {
                return true;
            })
            .catch((_: Error) => {
                return false;
            });
    }
}

export default InquireHistoryDao;
