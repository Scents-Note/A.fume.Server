'use strict';

const Note = require('../service/NoteService');
const { OK, INTERNAL_SERVER_ERROR } = require('../utils/statusCode.js');

module.exports.postNote = (req, res, next) => {
    const { ingredientName, perfumeName, type } = req.swagger.params[
        'body'
    ].value;
    Note.insertNote({
        ingredientName,
        perfumeName,
        type,
    })
        .then((response) => {
            res.status(OK).json({
                message: '노트 추가 성공',
                data: response,
            });
        })
        .catch((response) => {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.putNote = (req, res, next) => {
    const { ingredientName, perfumeName, type } = req.swagger.params[
        'body'
    ].value;
    Note.putNote({
        ingredientName,
        perfumeName,
        type,
    })
        .then((response) => {
            res.status(OK).json({
                message: '노트 수정 성공',
            });
        })
        .catch((response) => {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};
