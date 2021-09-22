const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const Perfume = require('../../service/PerfumeService.js');
const PerfumeIntegralDTO = require('../../data/dto/PerfumeIntegralDTO');

describe('# Perfume Service Test', () => {
    before(async function () {
        await require('../dao/common/presets.js')(this);
    });
    describe('# read Test', () => {
        it('# read detail Test', (done) => {
            Perfume.getPerfumeById(1, 1)
                .then((it) => {
                    PerfumeIntegralDTO.validTest.call(it);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# isLike Test', (done) => {
            Perfume.searchPerfume([], [], [], '', 1, 100, null, 1)
                .then((result) => {
                    expect(
                        result.rows.filter((it) => it.isLiked == true).length
                    ).to.eq(5);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
