import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import PerfumeDefaultReviewDao from '../../src/dao/PerfumeDefaultReviewDao';
import PerfumeDefaultReviewDTO from '../../src/data/dto/PerfumeDefaultReviewDTO';

const perfumeDefaultReviewDao = new PerfumeDefaultReviewDao();

describe('# perfumeDefaultReviewDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# readTest Test', () => {
        describe('# readByPerfumeIdx Test', () => {
            it('# success case', (done: Done) => {
                perfumeDefaultReviewDao
                    .readByPerfumeIdx(1)
                    .then((result: PerfumeDefaultReviewDTO) => {
                        expect(result).to.be.instanceOf(
                            PerfumeDefaultReviewDTO
                        );
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
    });
});
