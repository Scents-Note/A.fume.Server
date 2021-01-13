'use strict';
const noteDAO = require('../dao/NoteDao.js');

exports.insertNote = ({ ingredientName, perfumeName, type }) => {
    return noteDAO.create({
        ingredientName,
        perfumeName,
        type,
    });
};

exports.putNote = ({ ingredientName, perfumeName, type }) => {
    return noteDAO.updateType({
        type,
        perfumeName,
        ingredientName,
    });
};
