import { logger } from '@modules/winston';

import { ReportUserInquirePerfumeDTO } from '@dto/index';

const LOG_TAG: string = '[SearchHistory/DAO]';

const { ReportUserInquirePerfume } = require('@sequelize');

class ReportsDao {
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
