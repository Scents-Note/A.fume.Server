import { logger } from '@modules/winston';

const LOG_TAG: string = '[SearchHistory/DAO]';

import { ReportUserInquirePerfume } from '@sequelize';
import { Transaction } from 'sequelize';

class ReportsDao {
    /**
     * SearchHistory 대용량 삽입
     * @return {Promise}
     */
    async bulkInsertUserInquirePerfume(
        searchHistories: any,
        transaction: Transaction
    ): Promise<ReportUserInquirePerfume[]> {
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
    async clearUserInquirePerfume(transaction: Transaction): Promise<void> {
        logger.debug(
            `${LOG_TAG} clearUserInquirePerfume(transaction: ${transaction})`
        );
        await ReportUserInquirePerfume.destroy({ where: {}, transaction });
        return;
    }
}

export default ReportsDao;
