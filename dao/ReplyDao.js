const pool = require('../utils/db/pool.js');
const {
    NotMatchedError,
    FailedToCreateError,
} = require('../utils/errors/errors.js');

/**
 * 댓글 작성
 *
 */
const SQL_REPLY_INSERT = `INSERT reply(user_idx, review_idx, content) VALUES(?,?,?)`;
module.exports.create = ({ userIdx, reviewIdx, content }) => {
    return pool.queryParam_Parse(SQL_REPLY_INSERT, [
        userIdx,
        reviewIdx,
        content,
    ]);
};

/**
 * 댓글 조회
 *
 */
const SQL_REPLY_SELECT = `SELECT rp.user_idx AS userIdx, u.nickname, rp.content FROM reply rp INNER JOIN user u ON rp.user_idx = u.user_idx WHERE reply_idx = ?`;
module.exports.read = (replyIdx) => {
    return pool.queryParam_Parse(SQL_REPLY_SELECT, [replyIdx]);
};

/**
 * 특정 시향기의 댓글 전체 조회
 *
 */
const SQL_REPLY_SELECT_ALL = `SELECT rp.reply_idx AS replyIdx, rp.user_idx AS userIdx, u.nickname, rp.content FROM reply rp INNER JOIN user u ON rp.user_idx = u.user_idx WHERE review_idx = ?`;
module.exports.readAll = (reviewIdx) => {
    return pool.queryParam_Parse(SQL_REPLY_SELECT_ALL, [reviewIdx]);
};

/**
 * 댓글 수정
 *
 */
const SQL_REPLY_UPDATE = `UPDATE reply SET content = ? WHERE reply_idx = ?`;
module.exports.update = ({ replyIdx, content }) => {
    return pool.queryParam_Parse(SQL_REPLY_UPDATE, [content, replyIdx]);
};

/**
 * 댓글 삭제
 *
 */
const SQL_REPLY_DELETE = `DELETE FROM reply WHERE reply_idx = ? `;
module.exports.delete = (replyIdx) => {
    return pool.queryParam_Parse(SQL_REPLY_DELETE, [replyIdx]);
};
