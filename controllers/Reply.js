'use strict';

const Reply = require('../service/ReplyService');
const { OK, INTERNAL_SERVER_ERROR } = require('../utils/statusCode.js');

module.exports.deleteReply = function deleteReply(req, res, next) {
    const replyIdx = req.swagger.params['replyIdx'].value;
    Reply.deleteReply(replyIdx)
        .then(function (response) {
            res.status(OK).json(response);
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.getReplyByIdx = function getReplyByIdx(req, res, next) {
    const replyIdx = req.swagger.params['replyIdx'].value;
    Reply.getReplyByIdx(replyIdx)
        .then(function (response) {
            res.status(OK).json(response);
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.getReplyOfReview = function getReplyOfReview(req, res, next) {
    const reviewIdx = req.swagger.params['reviewIdx'].value;
    Reply.getReplyOfReview(reviewIdx)
        .then(function (response) {
            res.status(OK).json(response);
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.postReply = function postReply(req, res, next) {
    const reviewIdx = req.swagger.params['reviewIdx'].value;
    const { userIdx, content } = req.swagger.params['body'].value;
    Reply.postReply({ reviewIdx, userIdx, content })
        .then(function (response) {
            res.status(OK).json(response);
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.updateReply = function updateReply(req, res, next) {
    const replyIdx = req.swagger.params['replyIdx'].value;
    const { userIdx, content } = req.swagger.params['body'].value;
    Reply.updateReply({ replyIdx, content })
        .then(function (response) {
            res.status(OK).json(response);
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};
