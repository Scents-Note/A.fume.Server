const dotenv = require('dotenv');
dotenv.config();

const keywordDao = require('../../src/dao/KeywordDao');
const { expect } = require('chai');
const { Sequelize } = require('../../models');
const { Op } = Sequelize;

describe('# KeywordDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe('# readAll Test', () => {
        it('# success case', (done) => {
            keywordDao
                .readAll()
                .then((result) => {
                    expect(result.count).to.be.eq(5);
                    expect(result.rows.length).to.be.eq(5);
                    for (const keyword of result.rows) {
                        expect(keyword.id).to.be.ok;
                        expect(keyword.name).to.be.ok;
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# readAllOfPerfume Test', () => {
        it('# success case', (done) => {
            keywordDao
                .readAllOfPerfume(1, [['count', 'desc']], { [Op.gte]: 1 })
                .then((result) => {
                    expect(result.length).to.be.gte(2);
                    for (const keyword of result) {
                        expect(keyword.id).to.be.ok;
                        expect(keyword.name).to.be.ok;
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# readAllOfPerfume Test', () => {
        it('# success case', (done) => {
            keywordDao
                .readAllOfPerfumeIdxList([1], null, { [Op.gte]: 1 })
                .then((result) => {
                    expect(result.length).gte(2);
                    for (const keyword of result) {
                        expect(keyword.perfumeIdx).to.be.eq(1);
                        expect(keyword.keywordIdx).to.be.ok;
                        expect(keyword.count).to.be.ok;
                        expect(keyword.Keyword.id).to.eq(keyword.keywordIdx);
                        expect(keyword.Keyword.name).to.be.ok;
                    }
                    expect(
                        new Set(result.map((it) => it.keywordIdx))
                    ).to.have.property('size', result.length);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# readAllPerfumeKeywordCount Test', () => {
        it('# success case', (done) => {
            keywordDao
                .readAllPerfumeKeywordCount([1])
                .then((result) => {
                    expect(result.length).gte(2);
                    for (const keyword of result) {
                        expect(keyword.keywordIdx).to.be.ok;
                        expect(keyword.count).to.be.ok;
                    }
                    expect(
                        new Set(result.map((it) => it.keywordIdx))
                    ).to.have.property('size', result.length);
                    done();
                })
                .catch((err) => done(err));
        });
    });
    describe('# readPerfumeKeywordCount Test', () => {
        it('# success case', (done) => {
            keywordDao
                .readPerfumeKeywordCount({ perfumeIdx: 2, keywordIdx: 1 })
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
