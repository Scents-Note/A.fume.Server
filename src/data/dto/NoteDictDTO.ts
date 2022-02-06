import NoteDTO from './NoteDTO';

const {
    NOTE_TYPE_TOP,
    NOTE_TYPE_MIDDLE,
    NOTE_TYPE_BASE,
    NOTE_TYPE_SINGLE,
} = require('../../utils/constantUtil');

class NoteDictDTO {
    top: string;
    middle: string;
    base: string;
    single: string;
    constructor(top: string, middle: string, base: string, single: string) {
        this.top = top;
        this.middle = middle;
        this.base = base;
        this.single = single;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByNoteList(noteList: NoteDTO[]): NoteDictDTO {
        const topList: string[] = [];
        const middleList: string[] = [];
        const baseList: string[] = [];
        const singleList: string[] = [];

        noteList.forEach((it: NoteDTO) => {
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

        return new NoteDictDTO(
            topList.join(', '),
            middleList.join(', '),
            baseList.join(', '),
            singleList.join(', ')
        );
    }
    static createByJson(json: {
        top: string;
        middle: string;
        base: string;
        single: string;
    }) {
        return new NoteDictDTO(json.top, json.middle, json.base, json.single);
    }
}

export default NoteDictDTO;
