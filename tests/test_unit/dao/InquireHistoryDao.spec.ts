import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import InquireHistoryDao from '@dao/InquireHistoryDao';

const inquireHistoryDao = new InquireHistoryDao();

describe('# searchHistoryDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# create Test', () => {
        it('# success case', (done: Done) => {
            inquireHistoryDao
                .create(5, 1, '')
                .then((result: boolean) => {
                    expect(result).to.be.eq(true);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
