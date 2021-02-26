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
                    expect(it.Brand).to.be.not.null;
                    expect(it.MainSeries).to.be.not.null;
                    expect(it.PerfumeDetail).to.be.not.null;
                    expect(it.Notes).to.be.not.null;
                    if (it.Notes.noteType == 1) {
                        expect(it.Notes.ingredients.top).not.be.ok;
                        expect(it.Notes.ingredients.middle).not.be.ok;
                        expect(it.Notes.ingredients.base).not.be.ok;
                        expect(it.Notes.ingredients.single).be.ok;
                    } else {
                        expect(it.Notes.ingredients.top).be.ok;
                        expect(it.Notes.ingredients.middle).be.ok;
                        expect(it.Notes.ingredients.base).be.ok;
                        expect(it.Notes.ingredients.single).not.be.ok;
                    }
                    expect(it.Summary).to.be.ok;
                    expect(it.Summary.score).to.be.gte(0);

                    const sumOfMapFunc = (map) => {
                        let sum = 0;
                        for (const key in map) {
                            sum += map[key];
                        }
                        return sum;
                    };
                    expect(it.Summary.seasonal).to.be.ok;
                    expect(sumOfMapFunc(it.Summary.seasonal)).to.be.eq(100);
                    expect(it.Summary.longevity).to.be.ok;
                    expect(sumOfMapFunc(it.Summary.longevity)).to.be.eq(100);
                    expect(it.Summary.gender).to.be.ok;
                    expect(sumOfMapFunc(it.Summary.gender)).to.be.eq(100);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
