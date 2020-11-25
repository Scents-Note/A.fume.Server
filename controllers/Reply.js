'use strict';

var utils = require('../utils/writer.js');
var Reply = require('../service/ReplyService');

module.exports.deleteReply = function deleteReply (req, res, next) {
  var replyIdx = req.swagger.params['replyIdx'].value;
  Reply.deleteReply(replyIdx)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getReplyByIdx = function getReplyByIdx (req, res, next) {
  var replyIdx = req.swagger.params['replyIdx'].value;
  Reply.getReplyByIdx(replyIdx)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getReplyOfReview = function getReplyOfReview (req, res, next) {
  var reviewIdx = req.swagger.params['reviewIdx'].value;
  Reply.getReplyOfReview(reviewIdx)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.insertReply = function insertReply (req, res, next) {
  var body = req.swagger.params['body'].value;
  Reply.insertReply(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateReply = function updateReply (req, res, next) {
  var replyIdx = req.swagger.params['replyIdx'].value;
  var body = req.swagger.params['body'].value;
  Reply.updateReply(replyIdx,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
