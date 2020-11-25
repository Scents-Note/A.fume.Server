'use strict';


/**
 * 댓글 삭제
 * 댓글 삭제하기
 *
 * replyIdx Long 댓글 Idx
 * no response value expected for this operation
 **/
exports.deleteReply = function(replyIdx) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * 댓글 반환
 * 시향노트에 달린 특정 댓글 가져오기
 *
 * replyIdx Long 댓글 Idx
 * returns ReplyInfo
 **/
exports.getReplyByIdx = function(replyIdx) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "replyIdx" : 0,
  "content" : "저한테도 인생 향수에요~"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * 전체 댓글 반환
 * 특정 시향노트에 달린 전체 댓글 가져오기
 *
 * reviewIdx Long 시향노트 Idx
 * returns List
 **/
exports.getReplyOfReview = function(reviewIdx) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "replyIdx" : 0,
  "content" : "저한테도 인생 향수에요~"
}, {
  "replyIdx" : 0,
  "content" : "저한테도 인생 향수에요~"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * 댓글 추가
 * 시향노트에 댓글 추가하기
 *
 * body ReplyInfo 댓글 정보
 * no response value expected for this operation
 **/
exports.insertReply = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * 댓글 수정
 * 댓글 수정하기
 *
 * replyIdx Long 댓글 Idx
 * body ReplyInfo  (optional)
 * no response value expected for this operation
 **/
exports.updateReply = function(replyIdx,body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

