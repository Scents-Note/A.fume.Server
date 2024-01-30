import { logger } from '@modules/winston';

import ReportsDao from '@dao/ReportsDao';

import InquireHistoryDao from '@src/dao/InquireHistoryDao';
import { InquireHistoryDTO } from '@src/data/dto/InquireHistoryDTO';
import _ from 'lodash';
import { ReportUserInquirePerfumeDTO } from '@src/data/dto';

/* TODO Service에서 Sequelize Dependency 제거 해야함 */
import { sequelize } from '@sequelize';

const LOG_TAG: string = '[SearchHistory/Service]';

class SearchHistoryService {
    reportsDao: ReportsDao;
    inquireHistoryDao: InquireHistoryDao;
    constructor(
        searchHistoryDao?: ReportsDao,
        inquireHistoryDao?: InquireHistoryDao
    ) {
        this.reportsDao = searchHistoryDao || new ReportsDao();
        this.inquireHistoryDao = inquireHistoryDao || new InquireHistoryDao();
    }
    /**
     * 향수 조회 정보 기록
     *
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @returns {Promise<void>}
     **/
    async recordInquire(
        userIdx: number,
        perfumeIdx: number,
        routes: string
    ): Promise<void> {
        logger.debug(
            `${LOG_TAG} recordInquireHistory(userIdx = ${userIdx}, perfumeIdx = ${perfumeIdx}, routes = ${routes})`
        );
        if (userIdx == -1) return;
        this.inquireHistoryDao.create(userIdx, perfumeIdx, routes);
    }

    /**
     * SearchHistory 최신화
     *
     * @returns {Promise<void>}
     **/
    async reloadSearchHistory(): Promise<void> {
        logger.debug(`${LOG_TAG} reloadSearchHistory()`);

        return this.inquireHistoryDao
            .findAll()
            .then(
                (
                    result: InquireHistoryDTO[]
                ): ReportUserInquirePerfumeDTO[] => {
                    return _.chain(result)
                        .countBy(
                            (it: InquireHistoryDTO) =>
                                it.userIdx + '/' + it.perfumeIdx
                        )
                        .map((count: number, key: string) => {
                            const splitted: number[] = key
                                .split('/')
                                .map((it) => parseInt(it));
                            const userIdx: number = splitted[0];
                            const perfumeIdx: number = splitted[1];
                            return new ReportUserInquirePerfumeDTO(
                                userIdx,
                                perfumeIdx,
                                count
                            );
                        })
                        .value();
                }
            )
            .then(async (searchHistories: ReportUserInquirePerfumeDTO[]) => {
                await sequelize.transaction(async (t: any) => {
                    await this.reportsDao.clearUserInquirePerfume(t);
                    await this.reportsDao.bulkInsertUserInquirePerfume(
                        searchHistories,
                        t
                    );
                });
                return;
            });
    }
}

export default SearchHistoryService;
