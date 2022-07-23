import { logger } from '@modules/winston';

import SearchHistoryDao from '@dao/SearchHistoryDao';

import InquireHistoryDao from '@src/dao/InquireHistoryDao';

const LOG_TAG: string = '[SearchHistory/Service]';

class SearchHistoryService {
    searchHistoryDao: SearchHistoryDao;
    inquireHistoryDao: InquireHistoryDao;
    constructor(
        searchHistoryDao?: SearchHistoryDao,
        inquireHistoryDao?: InquireHistoryDao
    ) {
        this.searchHistoryDao = searchHistoryDao || new SearchHistoryDao();
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
}

export default SearchHistoryService;
