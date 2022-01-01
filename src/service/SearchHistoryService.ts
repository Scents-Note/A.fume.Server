import SearchHistoryDao from '../dao/SearchHistoryDao';
import SearchHistoryDTO from '../data/dto/SearchHistoryDTO';
import { NotMatchedError } from '../utils/errors/errors';

class SearchHistoryService {
    searchHistoryDao: SearchHistoryDao;
    constructor(searchHistoryDao?: SearchHistoryDao) {
        this.searchHistoryDao = searchHistoryDao || new SearchHistoryDao();
    }
    /**
     * 향수 조회 정보 업데이트
     *
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @returns {Promise}
     **/
    async incrementCount(userIdx: number, perfumeIdx: number): Promise<void> {
        if (userIdx == -1) return;
        this.searchHistoryDao
            .read(userIdx, perfumeIdx)
            .then((result: SearchHistoryDTO) => {
                return this.searchHistoryDao.update(
                    userIdx,
                    perfumeIdx,
                    result.count + 1
                );
            })
            .catch((err: Error) => {
                if (err instanceof NotMatchedError) {
                    return this.searchHistoryDao.create(userIdx, perfumeIdx, 1);
                }
                throw err;
            });
    }
}

export default SearchHistoryService;
