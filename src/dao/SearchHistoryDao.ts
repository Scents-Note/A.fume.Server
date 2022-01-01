import { NotMatchedError } from '../utils/errors/errors';
import SearchHistoryDTO from '../data/dto/SearchHistoryDTO';

const { SearchHistory } = require('../models');

class SearchHistoryDao {
    /**
     * 향수 조회 기록 조회
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @return {Promise<SearchHistoryDTO>}
     */
    async read(userIdx: number, perfumeIdx: number): Promise<SearchHistoryDTO> {
        return SearchHistory.findOne({
            where: { userIdx, perfumeIdx },
            raw: true,
            nest: true,
        }).then(SearchHistoryDTO.createByJson);
    }

    /**
     * 향수 조회 기록 생성
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @return {Promise}
     */
    async create(userIdx: number, perfumeIdx: number, count: number) {
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
