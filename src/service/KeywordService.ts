import KeywordDao from '@dao/KeywordDao';
import { Keyword } from '@src/models';

const keywordDao = new KeywordDao();

class KeywordService {
    /**
     * 키워드 전체 조회
     *
     * @returns {Promise<Keyword[]>}
     **/
    async getKeywordAll(pagingIndex: number, pagingSize: number) {
        const result = await keywordDao.readAll(pagingIndex, pagingSize);
        return {
            ...result,
            rows: result.rows.map(this.transform),
        };
    }

    /**
     * 특정 향수의 키워드 목록 조회
     *
     * @param {number} perfumeIdx
     * @returns {Promise<keyword[]>}
     */
    async getKeywordOfPerfume(perfumeIdx: number) {
        const keywords = await keywordDao.readAllOfPerfume(perfumeIdx);
        return keywords.map(this.transform);
    }

    private transform(it: Keyword) {
        return {
            ...it,
            id: undefined,
            keywordIdx: it.id,
        };
    }
}

export default KeywordService;
