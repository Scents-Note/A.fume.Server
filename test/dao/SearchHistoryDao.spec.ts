import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import SearchHistoryDao from '../../src/dao/SearchHistoryDao';
import SearchHistoryDTO from '../../src/data/dto/SearchHistoryDTO';
const searchHistoryDao = new SearchHistoryDao();
const { SearchHistory } = require('../../src/models');

describe('# searchHistoryDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# read Test', () => {
        it('# success case', (done: Done) => {
            searchHistoryDao
                .read(1, 1)
                .then((result: SearchHistoryDTO) => {
                    expect(result.userIdx).to.be.eq(1);
                    expect(result.perfumeIdx).to.be.eq(1);
                    expect(result.count).to.be.eq(1);
                    expect(result.createdAt).to.be.ok;
                    expect(result.updatedAt).to.be.ok;
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
    describe('# create Test', () => {
        before(async () => {
            await SearchHistory.destroy({
                where: { userIdx: 5, perfumeIdx: 1 },
            });
        });
        it('# success case', (done: Done) => {
            searchHistoryDao
                .create(5, 1, 1)
                .then((result: SearchHistoryDTO) => {
                    expect(result.userIdx).to.be.eq(5);
                    expect(result.perfumeIdx).to.be.eq(1);
                    expect(result.count).to.be.eq(1);
                    expect(result.createdAt).to.be.ok;
                    expect(result.updatedAt).to.be.ok;
                    done();
                })
                .catch((err: Error) => done(err));
        });
        after(async () => {
            await SearchHistory.destroy({
                where: { userIdx: 5, perfumeIdx: 1 },
            });
        });
    });
    describe('# update Test', () => {
        it('# success case', (done: Done) => {
            searchHistoryDao
                .update(1, 1, 5)
                .then((result: number) => {
                    expect(result).to.be.eq(1);
                    return SearchHistory.findOne({
                        where: { perfumeIdx: 1, userIdx: 1 },
                        nest: true,
                        raw: true,
                    });
                })
                .then((result: SearchHistoryDTO) => {
                    expect(result.perfumeIdx).to.be.eq(1);
                    expect(result.userIdx).to.be.eq(1);
                    expect(result.count).to.be.eq(5);
                    expect(result.createdAt).to.be.ok;
                    expect(result.updatedAt).to.be.ok;
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
