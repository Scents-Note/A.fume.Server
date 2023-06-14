import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import NoteDao from '@dao/NoteDao';

import { NoteDTO } from '@dto/index';

import { Ingredient } from '@sequelize';

const noteDao: NoteDao = new NoteDao();

describe('# NoteDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe(' # read Test', () => {
        it(' # readByPerfumeIdx test', (done: Done) => {
            noteDao
                .readByPerfumeIdx(1)
                .then(async (result: NoteDTO[]) => {
                    result.forEach((note) => {
                        expect(note).instanceOf(NoteDTO);
                    });
                    for (const note of result) {
                        const ingredient = await Ingredient.findByPk(
                            note.ingredientIdx
                        );
                        expect(note.ingredientName).to.be.eq(ingredient?.name);
                    }
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
