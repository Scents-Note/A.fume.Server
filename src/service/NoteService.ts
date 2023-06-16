import NoteDao from '@src/dao/NoteDao';
import { NoteDictDTO } from '@src/data/dto';
import {
    PERFUME_NOTE_TYPE_NORMAL,
    PERFUME_NOTE_TYPE_SINGLE,
} from '@src/utils/constants';

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
        const noteDictDTO: {
            top: string;
            middle: string;
            base: string;
            single: string;
        } = NoteDictDTO.createByNoteList(noteList);
        const noteType: number =
            noteDictDTO.single.length > 0
                ? PERFUME_NOTE_TYPE_SINGLE
                : PERFUME_NOTE_TYPE_NORMAL;
        return { noteType, noteDictDTO };
    }
}
