const keywordDao = require('../dao/KeywordDao');

/**
 * 키워드 전체 조회
 *
 * @returns {Promise<Keyword[]>}
 **/
exports.getKeywordAll = async (pagingIndex, pagingSize) => {
  let result = await keywordDao.readAll(pagingIndex, pagingSize);
  return result.rows.map((it) => {
    it.keywordIdx = it.id
    delete it.id;
    return it;
  });
};

/**
 * 특정 향수의 키워드 목록 조회
 *
 * @param {number} perfumeIdx
 * @returns {Promise<keyword[]>}
 */
exports.getKeywordOfPerfume = (perfumeIdx) => {
  return keywordDao.readAllOfPerfume(perfumeIdx);
}