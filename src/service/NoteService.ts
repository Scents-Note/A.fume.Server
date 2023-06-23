import NoteDao from '@src/dao/NoteDao';
import { NoteDTO } from '@src/data/dto';
import {
    NOTE_TYPE_BASE,
    NOTE_TYPE_MIDDLE,
    NOTE_TYPE_SINGLE,
    NOTE_TYPE_TOP,
    PERFUME_NOTE_TYPE_NORMAL,
    PERFUME_NOTE_TYPE_SINGLE,
} from '@src/utils/constants';

interface NoteDict {
    top: string;
    middle: string;
    base: string;
    single: string;
}

export class NoteService {
    noteDao: NoteDao;
    constructor(noteDao?: NoteDao) {
        this.noteDao = noteDao ?? new NoteDao();
    }

    async generateNote(perfumeIdx: number): Promise<{
        noteType: number;
        noteDictDTO: {
            top: string;
            middle: string;
            base: string;
            single: string;
        };
    }> {
        const noteList: any[] = await this.noteDao.readByPerfumeIdx(perfumeIdx);
        const noteDictDTO = this.createByNoteList(noteList);
        const noteType: number =
            noteDictDTO.single.length > 0
                ? PERFUME_NOTE_TYPE_SINGLE
                : PERFUME_NOTE_TYPE_NORMAL;
        return { noteType, noteDictDTO };
    }

    private createByNoteList(noteList: NoteDTO[]): NoteDict {
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

        return {
            top: topList.join(', '),
            middle: middleList.join(', '),
            base: baseList.join(', '),
            single: singleList.join(', '),
        };
    }
}
