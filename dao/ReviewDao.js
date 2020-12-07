const pool = require('../utils/db/pool.js');
const { NotMatchedError, FailedToCreateError, InvalidInputError } = require('../utils/errors/errors.js');

/**
 * 시향기 작성
 * 
 */
const SQL_REVIEW_INSERT = `INSERT review(perfume_idx, user_idx, score, longevity, sillage, seasonal, gender, access, content) VALUES(?,?,?,?,?,?,?,?,?)`;
module.exports.create = async ({perfumeIdx, userIdx, score, longevity, sillage, seasonal, gender, access, content}) => {
    /**
     * input data 변환
     */
    // 지속력
    switch(longevity){
        case '매우약함' : 
            longevity = 1;
            break;
        case '약함':
            longevity = 2;
            break;
        case '보통':
            longevity = 3;
            break;
        case '강함':
            longevity = 4;
            break;
        case '매우 강함':
            longevity = 5;
            break;
        case null:
            break;
        default:
            throw new InvalidInputError();
    };
    // 잔향감
    switch(sillage){
        case '가벼움' : 
            sillage = 1;
            break;
        case '보통':
            sillage = 2;
            break;
        case '무거움':
            sillage = 3;
            break;
        case null:
            break;
        default:
            throw new InvalidInputError();
    };
    // 계절감
    seasonal = seasonal.map(season => {
        switch(season){
            case "봄" : 
                season = "1";
                break;
            case "여름":
                season = "2";
                break;
            case "가을":
                season = "3";
                break;
            case "겨울":
                season = "4";
                break;
            case null:
                break;
            default:
                throw new InvalidInputError();
        };
        return season
    });
    seasonal = seasonal.join('|');  //배열 요소 join해서 문자열로 DB에 저장
    // 성별감
    switch(gender){
        case '남성' : 
            gender = 1;
            break;
        case '중성':
            gender = 2;
            break;
        case '여성':
            gender = 3;
            break;
        case null:
            break;
        default:
            throw new InvalidInputError();
    };
    // 공유 여부
    access = access? 1 : 0;
    
    const result = await pool.queryParam_Parse(SQL_REVIEW_INSERT, [perfumeIdx, userIdx, score, longevity, sillage, seasonal, gender, access, content]);
    if (result.affectedRows == 0) {
        throw new FailedToCreateError();
    }
    return result;
}

/**
 * 시향기 조회
 * 
 */
const SQL_REVIEW_SELECT_BY_IDX = `SELECT p.image_thumbnail_url as imageUrl, b.english_name as brandName, p.name, rv.score, rv.content, rv.longevity, rv.sillage, rv.seasonal, rv.gender, rv.access, u.user_idx, u.nickname FROM review rv NATURAL JOIN perfume p JOIN brand b ON p.brand_idx = b.brand_idx JOIN user u ON rv.user_idx = u.user_idx WHERE review_idx = ?`;
module.exports.read = async (reviewIdx) => {
    
    const result = await pool.queryParam_Parse(SQL_REVIEW_SELECT_BY_IDX, [reviewIdx]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    
    /**
     * output data(result) 변환
     */
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
        if (it.seasonal != null) {
            it.seasonal = it.seasonal.split('|');
            it.seasonal = it.seasonal.map(season => {
                switch(season){
                    case "1": 
                        season = "봄";
                        break;
                    case "2":
                        season = "여름";
                        break;
                    case "3":
                        season = "가을";
                        break;
                    case "4":
                        season = "겨울";
                        break;
                };
                return season;
            });
        }
        // 성별감
        switch(it.gender){
            case 1 : 
                it.gender = '남성';
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
    });
    //console.log(result[0])
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

    /**
     * output data(result) 변환
     */
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
        if (it.seasonal != null) {
            it.seasonal = it.seasonal.split('|');
            it.seasonal = it.seasonal.map(season => {
                switch(season){
                    case "1": 
                        season = "봄";
                        break;
                    case "2":
                        season = "여름";
                        break;
                    case "3":
                        season = "가을";
                        break;
                    case "4":
                        season = "겨울";
                        break;
                };
                return season;
            });
        };
        // 성별감
        switch(it.gender){
            case 1 : 
                it.gender = '남성';
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
    //console.log(result)
    return result;
}

/**
 * 특정 상품의 시향기 전체 조회(별점 순 정렬)
 * 별점이 없는 시향기들은 맨 후반부에 출력됨. 
 * 1차 정렬 기준은 별점순, 만약 별점이 같거나 없는 경우는 최신 순으로 해당부분만 2차 정렬됨.
 */
const SQL_REVIEW_SELECT_ALL_BY_SCORE = `SELECT review_idx, (DATE_FORMAT(now(), '%Y') - u.birth + 1) as age, u.gender, rv.content, rv.score, rv.longevity, rv.sillage, rv.seasonal, rv.gender, rv.access, 
u.nickname, rv.create_time as createTime FROM review rv JOIN user u ON rv.user_idx = u.user_idx WHERE perfume_idx = ? ORDER BY score desc, rv.create_time desc`;
module.exports.readAllOrderByScore = async (perfumeIdx) => {

    let result = await pool.queryParam_Parse(SQL_REVIEW_SELECT_ALL_BY_SCORE, [perfumeIdx]);
    
    /**
     * output data(result) 변환
     */
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
        if (it.seasonal != null) {
            it.seasonal = it.seasonal.split('|');
            it.seasonal = it.seasonal.map(season => {
                switch(season){
                    case "1": 
                        season = "봄";
                        break;
                    case "2":
                        season = "여름";
                        break;
                    case "3":
                        season = "가을";
                        break;
                    case "4":
                        season = "겨울";
                        break;
                };
                return season;
            });
        };
        // 성별감
        switch(it.gender){
            case 1 : 
                it.gender = '남성';
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
    
    /**
     * output data(result) 변환
     */
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
        if (it.seasonal != null) {
            it.seasonal = it.seasonal.split('|');
            it.seasonal = it.seasonal.map(season => {
                switch(season){
                    case "1": 
                        season = "봄";
                        break;
                    case "2":
                        season = "여름";
                        break;
                    case "3":
                        season = "가을";
                        break;
                    case "4":
                        season = "겨울";
                        break;
                };
                return season;
            });
        };
        // 성별감
        switch(it.gender){
            case 1 : 
                it.gender = '남성';
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
    /**
     * input data 변환
     */
    // 지속력
    switch(longevity){
        case '매우 약함' : 
            longevity = 1;
            break;
        case '약함':
            longevity = 2;
            break;
        case '보통':
            longevity = 3;
            break;
        case '강함':
            longevity = 4;
            break;
        case '매우 강함':
            longevity = 5;
            break;
        case null:
            break;
        default:
            throw new InvalidInputError();
    };
    // 잔향감
    switch(sillage){
        case '가벼움' : 
            sillage = 1;
            break;
        case '보통':
            sillage = 2;
            break;
        case '무거움':
            sillage = 3;
            break;
        case null:
            break;
        default:
            throw new InvalidInputError();
    };
    // 계절감
    seasonal = seasonal.map(season => {
        switch(season){
            case "봄" : 
                season = "1";
                break;
            case "여름":
                season = "2";
                break;
            case "가을":
                season = "3";
                break;
            case "겨울":
                season = "4";
                break;
            case null:
                break;
            default:
                throw new InvalidInputError();
        };
        return season
    });
    seasonal = seasonal.join('|');  //배열 요소 join해서 문자열로 DB에 저장
    // 성별감
    switch(gender){
        case '남성' : 
            gender = 1;
            break;
        case '중성':
            gender = 2;
            break;
        case '여성':
            gender = 3;
            break;
        case null:
            break;
        default:
            throw new InvalidInputError();
    };
    // 공유 여부
    access = access? 1 : 0;
    //return pool.queryParam_Parse(SQL_REVIEW_UPDATE, [score, longevity, sillage, seasonal, gender, access, content, reviewIdx]);
    const result = await pool.queryParam_Parse(SQL_REVIEW_UPDATE, [score, longevity, sillage, seasonal, gender, access, content, reviewIdx]);
    if (result.affectedRows == 0) {
        throw new NotMatchedError();
    }
    return result;
}

/**
 * 시향기 삭제
 */
const SQL_REVIEW_DELETE = `DELETE FROM review WHERE review_idx = ?`;
module.exports.delete = async (reviewIdx) => {
    const result = pool.queryParam_Parse(SQL_REVIEW_DELETE, [reviewIdx]);   
    if (result.affectedRows == 0) {
        throw new NotMatchedError();
    }
    return result;
}