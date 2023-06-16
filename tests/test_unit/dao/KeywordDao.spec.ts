import { expect } from 'chai';
import { Op } from 'sequelize';

import KeywordDao from '@dao/KeywordDao';

const keywordDao = new KeywordDao();

describe('# KeywordDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe('# readAll Test', () => {
        it('# success case', async () => {
            const result = await keywordDao.readAll();
            expect(result.count).to.be.eq(5);
            expect(result.rows.length).to.be.eq(5);
            for (const keyword of result.rows) {
                expect(keyword.id).to.be.ok;
                expect(keyword.name).to.be.ok;
            }
        });
    });

    describe('# readAllOfPerfume Test', () => {
        it('# success case', async () => {
            const result = await keywordDao.readAllOfPerfume(
                1,
                [['count', 'desc']],
                {
                    count: { [Op.gte]: 1 },
                }
            );
            expect(result.length).to.be.gte(2);
            for (const keyword of result) {
                expect(keyword.id).to.be.ok;
                expect(keyword.name).to.be.ok;
            }
        });
    });

    describe('# readAllOfPerfume Test', () => {
        it('# success case', async () => {
            const result = await keywordDao.readAllOfPerfumeIdxList(
                [1],
                undefined,
                {
                    count: { [Op.gte]: 1 },
                }
            );
            expect(result.length).gte(2);
            for (const keyword of result) {
                expect(keyword.perfumeIdx).to.be.eq(1);
                expect(keyword.keywordIdx).to.be.ok;
                expect(keyword.count).to.be.ok;
                expect(keyword.Keyword.id).to.eq(keyword.keywordIdx);
                expect(keyword.Keyword.name).to.be.ok;
            }
            expect(new Set(result.map((it) => it.keywordIdx))).to.have.property(
                'size',
                result.length
            );
        });
    });
});
