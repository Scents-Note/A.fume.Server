'use strict';

const replyDao = require('../dao/ReplyDao.js');

/**
 * 댓글 삭제
 * 댓글 삭제하기
 *
 * replyIdx Long 댓글 Idx
 * no response value expected for this operation
 **/
exports.deleteReply = (replyIdx) => {
    return replyDao.delete(replyIdx);
};

/**
 * 댓글 반환
 * 시향노트에 달린 특정 댓글 가져오기
 *
 * replyIdx Long 댓글 Idx
 * returns Reply
 **/
exports.getReplyByIdx = (replyIdx) => {
    return replyDao.read(replyIdx);
};

/**
 * 전체 댓글 반환
 * 특정 시향노트에 달린 전체 댓글 가져오기
 *
 * reviewIdx Long 시향노트 Idx
 * returns List
 **/
exports.getReplyOfReview = (reviewIdx) => {
    return replyDao.readAll(reviewIdx);
};

/**
 * 댓글 추가
 * 시향노트에 댓글 추가하기
 *
 * reviewIdx Long 시향노트 Idx
 * body ReplyInfo 댓글 정보
 * no response value expected for this operation
 **/
exports.postReply = ({ userIdx, reviewIdx, content }) => {
    return replyDao.create({ userIdx, reviewIdx, content });
};

/**
 * 댓글 수정
 * 댓글 수정하기
 *
 * replyIdx Long 댓글 Idx
 * body ReplyInfo  (optional)
 * no response value expected for this operation
 **/
exports.updateReply = ({ replyIdx, content }) => {
    return replyDao.update({ replyIdx, content });
};
