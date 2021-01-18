'use strict';

const Note = require('../service/NoteService');
const { OK } = require('../utils/statusCode.js');

module.exports.postNote = (req, res, next) => {
    const { ingredientIdx, perfumeIdx, type } = req.swagger.params[
        'body'
    ].value;
    Note.insertNote({
        ingredientIdx,
        perfumeIdx,
        type,
    })
        .then((response) => {
            res.status(OK).json({
                message: '노트 추가 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.putNote = (req, res, next) => {
    const { ingredientIdx, perfumeIdx, type } = req.swagger.params[
        'body'
    ].value;
    Note.putNote({
        ingredientIdx,
        perfumeIdx,
        type,
    })
        .then((response) => {
            res.status(OK).json({
                message: '노트 수정 성공',
            });
        })
        .catch((err) => next(err));
};
