import KeywordDao from '@dao/KeywordDao';

const keywordDao = new KeywordDao();

/**
 * 키워드 전체 조회
 *
 * @returns {Promise<Keyword[]>}
 **/
exports.getKeywordAll = async (pagingIndex, pagingSize) => {
    const result = await keywordDao.readAll(pagingIndex, pagingSize);
    result.rows = await result.rows.map((it) => {
        it.keywordIdx = it.id;
        delete it.id;
        return it;
    });
    return result;
};

/**
 * 특정 향수의 키워드 목록 조회
 *
 * @param {number} perfumeIdx
 * @returns {Promise<keyword[]>}
 */
exports.getKeywordOfPerfume = async (perfumeIdx) => {
    return (await keywordDao.readAllOfPerfume(perfumeIdx)).map((it) => {
        it.keywordIdx = it.id;
        delete it.id;
        return it;
    });
};
