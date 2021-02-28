const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const Perfume = require('../../service/PerfumeService.js');

describe('# Perfume Service Test', () => {
    before(async function () {
        await require('../dao/common/presets.js')(this);
    });
    describe('# read Test', () => {
        it('# read detail Test', (done) => {
            Perfume.getPerfumeById(1, 1)
                .then((it) => {
                    expect(it.brandName).to.be.ok;
                    expect(it.story).to.be.ok;
                    if (it.noteType == 1) {
                        expect(it.ingredients.top).not.be.ok;
                        expect(it.ingredients.middle).not.be.ok;
                        expect(it.ingredients.base).not.be.ok;
                        expect(it.ingredients.single).be.ok;
                    } else {
                        expect(it.ingredients.top).be.ok;
                        expect(it.ingredients.middle).be.ok;
                        expect(it.ingredients.base).be.ok;
                        expect(it.ingredients.single).not.be.ok;
                    }
                    expect(it.score).to.be.gte(0);

                    const sumOfMapFunc = (map) => {
                        let sum = 0;
                        for (const key in map) {
                            sum += map[key];
                        }
                        return sum;
                    };
                    expect(it.seasonal).to.be.ok;
                    expect(sumOfMapFunc(it.seasonal)).to.be.eq(100);
                    expect(it.longevity).to.be.ok;
                    expect(sumOfMapFunc(it.longevity)).to.be.eq(100);
                    expect(it.gender).to.be.ok;
                    expect(sumOfMapFunc(it.gender)).to.be.eq(100);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
