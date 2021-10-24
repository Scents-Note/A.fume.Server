const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const perfumeDefaultReviewDao = require('../../dao/PerfumeDefaultReviewDao.js');
const PerfumeDefaultReviewDTO = require('../data/dto/PerfumeDefaultReviewDTO');

describe('# perfumeDefaultReviewDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# readTest Test', () => {
        describe('# readByPerfumeIdx Test', () => {
            it('# success case', (done) => {
                perfumeDefaultReviewDao
                    .readByPerfumeIdx(1)
                    .then((result) => {
                        expect(result).to.be.instanceOf(
                            PerfumeDefaultReviewDTO
                        );
                        PerfumeDefaultReviewDTO.validTest.call(result);
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });
});
