'use strict';
const noteDao = require('../dao/NoteDao.js');

exports.insertNote = ({ ingredientIdx, perfumeIdx, type }) => {
    return noteDao.create({
        ingredientIdx,
        perfumeIdx,
        type,
    });
};

exports.putNote = ({ ingredientIdx, perfumeIdx, type }) => {
    return noteDao.updateType({
        type,
        perfumeIdx,
        ingredientIdx,
    });
};
