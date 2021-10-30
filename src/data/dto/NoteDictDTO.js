'use strict';

const {
    NOTE_TYPE_TOP,
    NOTE_TYPE_MIDDLE,
    NOTE_TYPE_BASE,
    NOTE_TYPE_SINGLE,
} = require('../../utils/constantUtil');

class NoteDictDTO {
    constructor({ top, middle, base, single }) {
        this.top = top;
        this.middle = middle;
        this.base = base;
        this.single = single;
    }

    static createByNoteList(noteList) {
        const topList = [];
        const middleList = [];
        const baseList = [];
        const singleList = [];

        noteList.forEach((it) => {
            switch (it.type) {
                case NOTE_TYPE_TOP:
                    topList.push(it.ingredientName);
                    break;
                case NOTE_TYPE_MIDDLE:
                    middleList.push(it.ingredientName);
                    break;
                case NOTE_TYPE_BASE:
                    baseList.push(it.ingredientName);
                    break;
                case NOTE_TYPE_SINGLE:
                    singleList.push(it.ingredientName);
                    break;
            }
        });

        return new NoteDictDTO({
            top: topList.join(', '),
            middle: middleList.join(', '),
            base: baseList.join(', '),
            single: singleList.join(', '),
        });
    }
}

module.exports = NoteDictDTO;
