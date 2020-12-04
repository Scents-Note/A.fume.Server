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
const SQL_REVIEW_SELECT_BY_IDX = `SELECT p.image_thumbnail_url as imageUrl, b.english_name as brandName, p.name, score, content, longevity, sillage, seasonal, gender, access FROM review rv NATURAL JOIN perfume p JOIN brand b ON p.brand_idx = b.brand_idx WHERE review_idx = ?`;
module.exports.read = async (reviewIdx) => {
    const result = await pool.queryParam_Parse(SQL_REVIEW_SELECT_BY_IDX, [reviewIdx]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    result.map(it => {
        // 지속력
        switch(it.longevity){
            case 1 : 
                it.longevity = '매우약함';
                break;
            case 2:
                it.longevity = '약함';
                break;
            case 3:
                it.longevity = '보통';
                break;
            case 4:
                it.longevity = '강함';
                break;
            case 5:
                it.longevity = '매우 강함';
                break;
        };
        // 잔향감
        switch(it.sillage){
            case 1 : 
                it.sillage = '가벼움';
                break;
            case 2:
                it.sillage = '보통';
                break;
            case 3:
                it.sillage = '무거움';
                break;
        };
        // 계절감
        switch(it.seasonal){
            case 1 : 
                it.seasonal = '봄';
                break;
            case 2:
                it.seasonal = '여름';
                break;
            case 3:
                it.seasonal = '가을';
                break;
            case 4:
                it.seasonal = '겨울';
                break;
        };
        // 성별감
        switch(it.gender){
            case 1 : 
                it.gender = '남성';
                break;
                break;
            case 2:
                it.gender = '중성';
                break;
            case 3:
                it.gender = '여성';
                break;
        };
        // 공유 여부
        it.access = it.access == 1;
        return it;
    })
    return result[0];

}

/**
 * 내가 쓴 시향기 전체 조회
 *  = 마이퍼퓸 조회
 * 
 */
const SQL_REVIEW_SELECT_BY_USER = `SELECT review_idx as reviewIdx, b.english_name as brandName, p.name, rv.score, rv.content, rv.longevity, rv.sillage, rv.seasonal, rv.gender, rv.access FROM review rv NATURAL JOIN perfume p JOIN brand b ON p.brand_idx = b.brand_idx WHERE user_idx = ?`;
module.exports.readAllByUser = async (userIdx) => {
    let result = await pool.queryParam_Parse(SQL_REVIEW_SELECT_BY_USER, [userIdx]); 
    result.map(it => {
        // 지속력
        switch(it.longevity){
            case 1 : 
                it.longevity = '매우약함';
                break;
            case 2:
                it.longevity = '약함';
                break;
            case 3:
                it.longevity = '보통';
                break;
            case 4:
                it.longevity = '강함';
                break;
            case 5:
                it.longevity = '매우 강함';
                break;
        };
        // 잔향감
        switch(it.sillage){
            case 1 : 
                it.sillage = '가벼움';
                break;
            case 2:
                it.sillage = '보통';
                break;
            case 3:
                it.sillage = '무거움';
                break;
        };
        // 계절감
        switch(it.seasonal){
            case 1 : 
                it.seasonal = '봄';
                break;
            case 2:
                it.seasonal = '여름';
                break;
            case 3:
                it.seasonal = '가을';
                break;
            case 4:
                it.seasonal = '겨울';
                break;
        };
        // 성별감
        switch(it.gender){
            case 1 : 
                it.gender = '남성';
                break;
                break;
            case 2:
                it.gender = '중성';
                break;
            case 3:
                it.gender = '여성';
                break;
        };
        // 공유 여부
        it.access = it.access == 1;
        return it;
    })
    return result;
}

/**
 * 특정 상품의 시향기 전체 조회(별점 순 정렬)
 * 별점이 없는 시향기들은 맨 후반부에 출력됨. 
 * 1차 정렬 기준은 별점순, 만약 별점이 같거나 없는 경우는 최신 순으로 해당부분만 2차 정렬됨.
 */
const SQL_REVIEW_SELECT_ALL_BY_SCORE = `SELECT review_idx, (DATE_FORMAT(now(), '%Y') - u.birth + 1) as age, u.gender, rv.content, rv.score, rv.longevity, rv.sillage, rv.seasonal, rv.gender, rv.access, 
u.nickname, rv.create_time as createTime FROM review rv JOIN user u ON rv.user_idx = u.user_idx WHERE perfume_idx = ? ORDER BY score desc, rv.create_time desc`;
module.exports.readAll = async (perfumeIdx) => {
    let result = await pool.queryParam_Parse(SQL_REVIEW_SELECT_ALL_BY_SCORE, [perfumeIdx]);
    result.map(it => {
        // 지속력
        switch(it.longevity){
            case 1 : 
                it.longevity = '매우약함';
                break;
            case 2:
                it.longevity = '약함';
                break;
            case 3:
                it.longevity = '보통';
                break;
            case 4:
                it.longevity = '강함';
                break;
            case 5:
                it.longevity = '매우 강함';
                break;
        };
        // 잔향감
        switch(it.sillage){
            case 1 : 
                it.sillage = '가벼움';
                break;
            case 2:
                it.sillage = '보통';
                break;
            case 3:
                it.sillage = '무거움';
                break;
        };
        // 계절감
        switch(it.seasonal){
            case 1 : 
                it.seasonal = '봄';
                break;
            case 2:
                it.seasonal = '여름';
                break;
            case 3:
                it.seasonal = '가을';
                break;
            case 4:
                it.seasonal = '겨울';
                break;
        };
        // 성별감
        switch(it.gender){
            case 1 : 
                it.gender = '남성';
                break;
                break;
            case 2:
                it.gender = '중성';
                break;
            case 3:
                it.gender = '여성';
                break;
        };
        // 공유 여부
        it.access = it.access == 1;
        //console.log(it)
        return it;
    })
    return result;
}

/**
 * 특정 상품의 시향기 전체 조회(최신 순 정렬)
 * 
 */
const SQL_REVIEW_SELECT_ALL_BY_RECENT = `SELECT review_idx, (DATE_FORMAT(now(), '%Y') - u.birth + 1) as age, u.gender, rv.content, rv.score, rv.longevity, rv.sillage, rv.seasonal, rv.gender, rv.access, u.nickname, rv.create_time as createTime FROM review rv JOIN user u ON rv.user_idx = u.user_idx WHERE perfume_idx = ? ORDER BY rv.create_time desc`;
module.exports.readAllOrderByRecent = async (perfumeIdx) => {
    let result = await pool.queryParam_Parse(SQL_REVIEW_SELECT_ALL_BY_RECENT, [perfumeIdx]);
    result.map(it => {
        // 지속력
        switch(it.longevity){
            case 1 : 
                it.longevity = '매우약함';
                break;
            case 2:
                it.longevity = '약함';
                break;
            case 3:
                it.longevity = '보통';
                break;
            case 4:
                it.longevity = '강함';
                break;
            case 5:
                it.longevity = '매우 강함';
                break;
        };
        // 잔향감
        switch(it.sillage){
            case 1 : 
                it.sillage = '가벼움';
                break;
            case 2:
                it.sillage = '보통';
                break;
            case 3:
                it.sillage = '무거움';
                break;
        };
        // 계절감
        switch(it.seasonal){
            case 1 : 
                it.seasonal = '봄';
                break;
            case 2:
                it.seasonal = '여름';
                break;
            case 3:
                it.seasonal = '가을';
                break;
            case 4:
                it.seasonal = '겨울';
                break;
        };
        // 성별감
        switch(it.gender){
            case 1 : 
                it.gender = '남성';
                break;
                break;
            case 2:
                it.gender = '중성';
                break;
            case 3:
                it.gender = '여성';
                break;
        };
        // 공유 여부
        it.access = it.access == 1;
        //console.log(it)
        return it;
    })
    return result;
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