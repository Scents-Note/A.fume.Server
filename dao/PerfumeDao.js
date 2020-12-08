const pool = require('../utils/db/pool.js');

const { NotMatchedError, FailedToCreateError } = require('../utils/errors/errors.js');

const SQL_PERFUME_INSERT = 'INSERT perfume(brand_idx, main_series_idx, name, english_name, image_thumbnail_url, release_date) VALUES(?, ?, ?, ?, ?, ?)';
const SQL_PERFUME_DETAIL_INSERT = 'INSERT perfume_detail(perfume_idx, story, abundance_rate, volume_and_price, image_url) VALUES(?, ?, ?, ?, ?)';
const SQL_PERFUME_SELECT_BY_FILTER = 'SELECT p.perfume_idx as perfumeIdx, p.main_series_idx as mainSeriesIdx, p.brand_idx as brandIdx, p.name, p.english_name as englishName, p.image_thumbnail_url as imageUrl, p.release_Date as releaseDate, '+
'b.name as brandName, '+
's.name as mainSeriesName, '+
'(SELECT COUNT(*) FROM like_perfume lp WHERE lp.perfume_idx = p.perfume_idx) as likeCnt, ' +
'(SELECT COUNT(*) FROM like_perfume lp WHERE lp.perfume_idx = p.perfume_idx AND lp.user_idx = ?) as isLiked ' +
'FROM perfume p ' +
'INNER JOIN brand b ON p.brand_idx = b.brand_idx ' + 
'INNER JOIN series s ON p.main_series_idx = s.series_idx ';
const SQL_PERFUME_SELECT_BY_PERFUME_IDX = 'SELECT p.perfume_idx as perfumeIdx, p.brand_idx as brandIdx, p.main_series_idx as mainSeriesIdx, p.name, p.english_name as englishName, p.release_date as releaseDate, '+
'pd.story, pd.abundance_rate as abundanceRate, pd.volume_and_price as volumeAndPrice, pd.image_url as imageUrl, ' +
'b.name as brandName, '+
's.name as seriesName, ' +
'(SELECT COUNT(*) FROM like_perfume lp WHERE lp.perfume_idx = p.perfume_idx) as likeCnt, ' +
'(SELECT COUNT(*) FROM like_perfume lp WHERE lp.perfume_idx = p.perfume_idx AND lp.user_idx = ?) as isLiked ' +
'FROM perfume p ' +
'INNER JOIN perfume_detail pd ON p.perfume_idx = pd.perfume_idx ' +
'INNER JOIN brand b ON p.brand_idx = b.brand_idx ' +
'INNER JOIN series s ON p.main_series_idx = s.series_idx ' +
'WHERE p.perfume_idx = ?';
const SQL_WISHLIST_PERFUME_SELECT = 'SELECT ' +
'p.perfume_idx as perfumeIdx, p.main_series_idx as mainSeriesIdx, p.brand_idx as brandIdx, p.name, p.english_name as englishName, p.image_thumbnail_url as imageUrl, p.release_date as releaseDate, ' +
'b.name as brandName, ' +
's.name as mainSeriesName, ' +
'(SELECT COUNT(*) FROM like_perfume lp WHERE lp.perfume_idx = p.perfume_idx) as likeCnt, ' +
'(SELECT COUNT(*) FROM like_perfume lp WHERE lp.perfume_idx = p.perfume_idx AND lp.user_idx = ?) as isLiked ' +
'FROM wishlist w ' +
'INNER JOIN perfume p ON w.perfume_idx = p.perfume_idx ' +
'INNER JOIN brand b ON p.brand_idx = b.brand_idx ' +
'INNER JOIN series s ON p.main_series_idx = s.series_idx ' +
'WHERE w.user_idx = ? ' +
'ORDER BY w.priority DESC';
const SQL_RECENT_SEARCH_PERFUME_SELECT = 'SELECT ' +
'MAX(sh.create_time) as createTime, ' +
'p.perfume_idx as perfumeIdx, p.main_series_idx as mainSeriesIdx, p.brand_idx as brandIdx, p.name, p.english_name as englishName, p.image_thumbnail_url as imageUrl, p.release_date as releaseDate, ' +
'b.name as brandName, ' +
's.name as mainSeriesName, ' +
'(SELECT COUNT(*) FROM like_perfume lp WHERE lp.perfume_idx = p.perfume_idx) as likeCnt, ' +
'(SELECT COUNT(*) FROM like_perfume lp WHERE lp.perfume_idx = p.perfume_idx AND lp.user_idx = ?) as isLiked ' +
'FROM search_history sh ' +
'INNER JOIN perfume p ON sh.perfume_idx = p.perfume_idx ' +
'INNER JOIN brand b ON p.brand_idx = b.brand_idx ' +
'INNER JOIN series s ON p.main_series_idx = s.series_idx ' +
'WHERE sh.user_idx = ? ' +
'GROUP BY sh.perfume_idx ' +
'ORDER BY createTime DESC ' +
'LIMIT 10 ';
const SQL_RECOMMEND_PERFUME_BY_AGE_AND_GENDER__SELECT = 'SELECT ' +
'COUNT(*) as weight, ' +
'p.perfume_idx as perfumeIdx, p.main_series_idx as mainSeriesIdx, p.brand_idx as brandIdx, p.name, p.english_name as englishName, p.image_thumbnail_url as imageUrl, p.release_date as releaseDate, ' +
'b.name as brandName, ' +
's.name as mainSeriesName, ' +
'(SELECT COUNT(*) FROM like_perfume lp WHERE lp.perfume_idx = p.perfume_idx) as likeCnt, ' +
'(SELECT COUNT(*) FROM like_perfume lp WHERE lp.perfume_idx = p.perfume_idx AND lp.user_idx = ?) as isLiked ' +
'FROM search_history sh ' +
'INNER JOIN perfume p ON sh.perfume_idx = p.perfume_idx ' +
'INNER JOIN brand b ON p.brand_idx = b.brand_idx ' +
'INNER JOIN series s ON p.main_series_idx = s.series_idx ' +
'INNER JOIN user u ON sh.user_idx = u.user_idx ' +
'WHERE u.gender = ? AND (u.birth BETWEEN ? AND ?) ' +
'GROUP BY sh.perfume_idx ' +
'ORDER BY weight DESC ' +
'LIMIT 10 ';
const SQL_PERFUME_UPDATE = 'UPDATE perfume SET brand_idx = ?, main_series_idx = ?, name = ?, english_name = ?, image_thumbnail_url = ?, release_date = ? WHERE perfume_idx = ?';
const SQL_PERFUME_DETAIL_UPDATE = 'UPDATE perfume_detail SET story = ?, abundance_rate = ?, volume_and_price = ?, image_url = ? WHERE perfume_idx = ?';
const SQL_PERFUME_DELETE = 'DELETE FROM perfume WHERE perfume_idx = ?';

const genderMap = {
    '남자': 1,
    '여자': 2,
};

/**
 * 향수 추가
 * 
 * @param {Object} perfume
 * @returns {Promise}
 */
module.exports.create = async ({brandIdx, name, englishName, volumeAndPrice, imageThumbnailUrl, mainSeriesIdx, story, abundanceRate, imageUrl, releaseDate}) => {
    volumeAndPrice = JSON.stringify(volumeAndPrice);
    const result = await pool.Transaction(async (connection) => {
        const perfumeResult = await connection.query(SQL_PERFUME_INSERT, [brandIdx, mainSeriesIdx, name, englishName, imageThumbnailUrl, releaseDate]);
        if(perfumeResult.insertId == 0) {
            throw new FailedToCreateError();
        }
        const perfumeIdx = perfumeResult.insertId;
        const perfumeDetailResult = await connection.query(SQL_PERFUME_DETAIL_INSERT, [perfumeIdx, story, abundanceRate, volumeAndPrice, imageUrl]);
        if(perfumeDetailResult.affectedRows == 0) {
            throw new FailedToCreateError();
        }
        return perfumeIdx;
    });
    return result[0];
};

/**
 * 향수 검색
 * 
 * @param {Object} Filter - series, brands, keywords
 * @param {string} sortBy - like, recent, random
 * @param {number} [userIdx=-1]
 * @returns {Promise<Perfume[]>} perfumeList
 */
module.exports.search = async ({ series = [], brands = [], keywords = []}, sortBy = 'recent', userIdx = -1) => {
    let condition = '';
    let orderBy = '';
    if(series.length + brands.length + keywords.length > 0) {
        const conditions = [];
        if(series.length > 0) {
            conditions.push('(' + series.map(it => `s.name = '${it}'`).join(' OR ') + ')');
        }
        if(brands.length > 0) {
            conditions.push('(' + brands.map(it => `b.name = '${it}'`).join(' OR ') + ')');
        }
        if(keywords.length > 0) {
            // TODO Keyword
        }
        condition = 'WHERE ' + conditions.join(' AND ');
    }
    if(sortBy) {
        switch(sortBy){
            case 'like':
                orderBy = ' ORDER BY likeCnt DESC';
                break;
            case 'recent':
                orderBy = ' ORDER BY p.release_date DESC';
                break;
            case 'random':
                orderBy = ' ORDER BY RAND()';
                break;
        }
    }
    const result = await pool.queryParam_Parse(SQL_PERFUME_SELECT_BY_FILTER + condition + orderBy, [userIdx]);
    result.map(it => {
        it.isLiked = it.isLiked == 1;
        return it;
    })
    return result;
};

/**
 * 향수 세부 조회
 * 
 * @param {number} perfumeIdx
 * @param {number} [userIdx=-1]
 * @returns {Promise<Perfume>}
 */
module.exports.readByPerfumeIdx = async (perfumeIdx, userIdx = -1) => {
    const result = await pool.queryParam_Parse(SQL_PERFUME_SELECT_BY_PERFUME_IDX, [userIdx, perfumeIdx]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    result[0].volumeAndPrice = Object.entries(JSON.parse(result[0].volumeAndPrice)).map(([volume, price]) => {
        return { volume: parseInt(volume), price: parseInt(price) };
    });
    result[0].isLiked = result[0].isLiked == 1;
    return result[0];
};

/**
 * 위시 리스트에 속하는 향수 조회
 * 
 * @param {number} [userIdx = -1]
 * @returns {Promise<Perfume[]>} perfumeList
 */
module.exports.readAllOfWishlist = async (userIdx) => {
    const result = await pool.queryParam_Parse(SQL_WISHLIST_PERFUME_SELECT, [userIdx, userIdx]);
    result.map(it => {
        it.isLiked = it.isLiked == 1;
        return it;
    })
    return result;
};

/**
 * 최근에 검색한 향수 조회
 * 
 * @param {number} userIdx
 * @returns {Promise<Perfume[]>}
 */
module.exports.recentSearchPerfumeList = async (userIdx) => {
    const result = await pool.queryParam_Parse(SQL_RECENT_SEARCH_PERFUME_SELECT, [userIdx, userIdx]);
    return result.map(it => {
        delete it.createTime
        return it;
    });
};

/**
 * 나이 및 성별에 기반한 향수 추천
 * 
 * @param {string} gender
 * @param {number} startBirth
 * @param {number} endBirth
 * @returns {Promise<Perfume[]>}
 */
module.exports.recommendPerfumeByAgeAndGender = async (userIdx, gender, startBirth, endBirth) => {
    gender = genderMap[gender] || 2;
    const result = await pool.queryParam_Parse(SQL_RECOMMEND_PERFUME_BY_AGE_AND_GENDER__SELECT,  [userIdx, gender, startBirth, endBirth]);
    return result.map(it => {
        delete it.createTime
        delete it.weight
        return it;
    });
};

/**
 * 향수 수정
 * 
 * @param {Object} perfume - perfume & perfumeDetail을 합친 정보
 * @returns {Promise}
 */
module.exports.update = ({perfumeIdx, name, mainSeriesIdx, brandIdx, englishName, volumeAndPrice, imageThumbnailUrl, story, abundanceRate, imageUrl, releaseDate}) => {
    return pool.Transaction(async (connection) => {
        const { affectedRows } = await connection.query(SQL_PERFUME_UPDATE, [brandIdx, mainSeriesIdx, name, englishName, imageThumbnailUrl, releaseDate, perfumeIdx]);
        if (affectedRows == 0) {
            throw new NotMatchedError();
        }
        return affectedRows;
    }, async (connection) => {
        const { affectedRows } = await connection.query(SQL_PERFUME_DETAIL_UPDATE, [story, abundanceRate, volumeAndPrice, imageUrl, perfumeIdx]);
        if (affectedRows == 0) {
            throw new NotMatchedError();
        }
        return affectedRows;
    });
};

/**
 * 향수 삭제
 * 
 * @param {number} perfumeIdx
 * @return {Promise<number>}
 */
module.exports.delete = async (perfumeIdx) => {   
    const { affectedRows } = await pool.queryParam_Parse(SQL_PERFUME_DELETE, [perfumeIdx]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};
