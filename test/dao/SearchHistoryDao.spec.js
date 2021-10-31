const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const searchHistoryDao = require('../../src/dao/SearchHistoryDao.js');
const { SearchHistory } = require('../../src/models');

describe('# searchHistoryDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# read Test', () => {
        it('# success case', (done) => {
            searchHistoryDao
                .read(1, 1)
                .then((result) => {
                    expect(result.userIdx).to.be.eq(1);
                    expect(result.perfumeIdx).to.be.eq(1);
                    expect(result.count).to.be.eq(1);
                    expect(result.createdAt).to.be.ok;
                    expect(result.updatedAt).to.be.ok;
                    done();
                })
                .catch((err) => done(err));
        });
    });
    describe('# create Test', () => {
        before(async () => {
            await SearchHistory.destroy({
                where: { userIdx: 5, perfumeIdx: 1 },
            });
        });
        it('# success case', (done) => {
            searchHistoryDao
                .create(5, 1, 1)
                .then((result) => {
                    expect(result.userIdx).to.be.eq(5);
                    expect(result.perfumeIdx).to.be.eq(1);
                    expect(result.count).to.be.eq(1);
                    expect(result.createdAt).to.be.ok;
                    expect(result.updatedAt).to.be.ok;
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await SearchHistory.destroy({
                where: { userIdx: 5, perfumeIdx: 1 },
            });
        });
    });
    describe('# update Test', () => {
        it('# success case', (done) => {
            searchHistoryDao
                .update(1, 1, 5)
                .then((result) => {
                    expect(result).to.be.eq(1);
                    return SearchHistory.findOne({
                        where: { perfumeIdx: 1, userIdx: 1 },
                        nest: true,
                        raw: true,
                    });
                })
                .then((result) => {
                    expect(result.perfumeIdx).to.be.eq(1);
                    expect(result.userIdx).to.be.eq(1);
                    expect(result.count).to.be.eq(5);
                    expect(result.createdAt).to.be.ok;
                    expect(result.updatedAt).to.be.ok;
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
