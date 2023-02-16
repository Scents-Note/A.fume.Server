import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import ReportsDao from '@dao/ReportsDao';
import { ReportUserInquirePerfumeDTO } from '@dto/index';

const { ReportUserInquirePerfume } = require('@sequelize');

const reportsDao = new ReportsDao();

describe('# ReportsDap Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# read Test', () => {
        it('# success case', (done: Done) => {
            reportsDao
                .readUserInquirePerfume(1, 1)
                .then((result: ReportUserInquirePerfumeDTO) => {
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
            await ReportUserInquirePerfume.destroy({
                where: { userIdx: 5, perfumeIdx: 1 },
            });
        });
        it('# success case', (done: Done) => {
            reportsDao
                .createUserInquirePerfume(5, 1, 1)
                .then((result: ReportUserInquirePerfumeDTO) => {
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
            await ReportUserInquirePerfume.destroy({
                where: { userIdx: 5, perfumeIdx: 1 },
            });
        });
    });
    describe('# update Test', () => {
        it('# success case', (done: Done) => {
            reportsDao
                .updateUserInquirePerfume(1, 1, 5)
                .then((result: number) => {
                    expect(result).to.be.eq(1);
                    return ReportUserInquirePerfume.findOne({
                        where: { perfumeIdx: 1, userIdx: 1 },
                        nest: true,
                        raw: true,
                    });
                })
                .then((result: ReportUserInquirePerfumeDTO) => {
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
