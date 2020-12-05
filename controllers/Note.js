'use strict';

const utils = require('../utils/writer.js');
const Note = require('../service/NoteService');

module.exports.postNote = (req, res, next) => {
    const {
        ingredientName,
        perfumeName,
        type
    } = req.swagger.params['body'].value;
    Note.insertNote({
        ingredientName,
        perfumeName,
        type
    }).then((response) => {
        utils.writeJson(res, utils.respondWithCode(200, {
            message: '노트 추가 성공',
            data: response
        }));
    })
    .catch((response) => {
        utils.writeJson(res, response);
    });
};

module.exports.putNote = (req, res, next) => {
    const {
        ingredientName,
        perfumeName,
        type
    } = req.swagger.params['body'].value;
    Note.putNote({
        ingredientName,
        perfumeName,
        type
    }).then((response) => {
        utils.writeJson(res, utils.respondWithCode(200, {
            message: '노트 수정 성공'
        }));
    })
    .catch((response) => {
        utils.writeJson(res, response);
    });
}