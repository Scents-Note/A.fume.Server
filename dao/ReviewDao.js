const pool = require('../utils/db/pool.js');
const { NotMatchedError, FailedToCreateError } = require('../utils/errors/errors.js');

/**
 * 시향기 작성
 * 
 */
const SQL_REVIEW_INSERT = `INSERT review(perfume_idx, user_idx, score, longevity, sillage, seasonal, gender, access, content) VALUES(?,?,?,?,?,?,?,?,?)`;
module.exports.create = async ({perfume_idx, user_idx, score, longevity, sillage, seasonal, gender, access, content}) => {
    return pool.queryParam_Parse(SQL_REVIEW_INSERT, [perfume_idx, user_idx, score, longevity, sillage, seasonal, gender, access, content]);
}

/**
 * 시향기 조회
 * 
 */
const SQL_REVIEW_SELECT_BY_IDX = `SELECT p.image_thumbnail_url as imageUrl, b.english_name as brandName, p.name, score, content, longevity, sillage, seasonal, gender, access  FROM review rv NATURAL JOIN perfume p JOIN brand b ON p.brand_idx = b.brand_idx WHERE review_idx = ?`;
module.exports.read = async (reviewIdx) => {
    const result = await pool.queryParam_Parse(SQL_REVIEW_SELECT_BY_IDX, [reviewIdx]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    return result[0];

}

/**
 * 내가 쓴 시향기 전체 조회
 *  = 마이퍼퓸 조회
 * 
 */
const SQL_REVIEW_SELECT_BY_USER = `SELECT review_idx as reviewIdx, b.english_name as brandName, p.name, score FROM review rv NATURAL JOIN perfume p JOIN brand b ON p.brand_idx = b.brand_idx WHERE user_idx = ?`;
module.exports.readAllByUser = async (userIdx) => {
    return pool.queryParam_Parse(SQL_REVIEW_SELECT_BY_USER, [userIdx]);
}

/**
 * 특정 상품의 시향기 전체 조회(디폴트, 별점 순 정렬)
 * 별점이 없는 시향기들은 맨 후반부에 출력됨. (기획과 논의됨)
 * 1차 정렬 기준은 별점순, 만약 별점이 같거나 없는 경우는 최신 순으로 해당부분만 2차 정렬됨.(기획과 논의됨)
 */
const SQL_REVIEW_SELECT_ALL_BY_SCORE = `SELECT review_idx, (DATE_FORMAT(now(), '%Y') - u.birth + 1) as age, u.gender, rv.content, rv.score, u.nickname, rv.create_time as createTime FROM review rv JOIN user u ON rv.user_idx = u.user_idx WHERE perfume_idx = ? ORDER BY score desc, rv.create_time desc`;
module.exports.readAll = async (perfumeIdx) => {
    return pool.queryParam_Parse(SQL_REVIEW_SELECT_ALL_BY_SCORE, [perfumeIdx]);
}

/**
 * 특정 상품의 시향기 전체 조회(최신 순 정렬)
 * 
 */
const SQL_REVIEW_SELECT_ALL_BY_RECENT = `SELECT review_idx, (DATE_FORMAT(now(), '%Y') - u.birth + 1) as age, u.gender, rv.content, rv.score, u.nickname, rv.create_time as createTime FROM review rv JOIN user u ON rv.user_idx = u.user_idx WHERE perfume_idx = ? ORDER BY rv.create_time desc`;
module.exports.readAllOrderByRecent = async (perfumeIdx) => {
    return pool.queryParam_Parse(SQL_REVIEW_SELECT_ALL_BY_RECENT, [perfumeIdx]);
}

/**
 * 시향기 수정
 * 
 */
const SQL_REVIEW_UPDATE = `UPDATE review SET score = ?, longevity = ?, sillage = ?, seasonal = ?, gender = ?, access = ?, content = ?  WHERE review_idx = ?`;
module.exports.update = async ({score, longevity, sillage, seasonal, gender, access, content, reviewIdx}) => {
    return pool.queryParam_Parse(SQL_REVIEW_UPDATE, [score, longevity, sillage, seasonal, gender, access, content, reviewIdx]);
}

/**
 * 시향기 삭제
 */
const SQL_REVIEW_DELETE = `DELETE FROM review WHERE review_idx = ?`;
module.exports.delete = async (reviewIdx) => {
    return pool.queryParam_Parse(SQL_REVIEW_DELETE, [reviewIdx]);   
}