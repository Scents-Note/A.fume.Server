const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const likeDao = require('../../dao/LikeDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError,
} = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');

describe('# likeDao Test', () => {
    describe('# create Test', () => {
        before(async () => {
            await pool.queryParam_Parse(
                'DELETE FROM like_perfume WHERE user_idx = ? AND perfume_idx = ?',
                [1, 1]
            );
        });
        it('# success case', (done) => {
            likeDao.create(1, 1).then((result) => {
                expect(result).gt(0);
                done();
            });
        });
        it('# DuplicatedEntryError case', (done) => {
            likeDao
                .create(1, 1)
                .then(() => {
                    expect(false).true();
                    done();
                })
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                });
        });
    });

    describe('# read case', () => {
        before(async () => {
            await pool.queryParam_Parse(
                'INSERT IGNORE like_perfume(user_idx, perfume_idx) VALUES(?, ?)',
                [1, 1]
            );
        });
        it('# success case', (done) => {
            likeDao.read(1, 1).then((result) => {
                expect(result.userIdx).eq(1);
                expect(result.perfumeIdx).eq(1);
                done();
            });
        });

        it('# fail case', (done) => {
            likeDao
                .read(-1, 1)
                .then((result) => {
                    expect(false).true();
                    done();
                })
                .catch((err) => {
                    expect(err).instanceof(NotMatchedError);
                    done();
                });
        });

        after(async () => {
            await pool.queryParam_Parse(
                'DELETE FROM like_perfume WHERE user_idx = ? AND perfume_idx = ?',
                [1, 1]
            );
        });
    });

    describe('# delete Test', () => {
        before(async () => {
            await pool.queryParam_Parse(
                'INSERT IGNORE like_perfume(user_idx, perfume_idx) VALUES(?, ?)',
                [1, 1]
            );
        });
        it('# success case', (done) => {
            likeDao.delete(1, 1).then((result) => {
                expect(result).eq(1);
                done();
            });
        });
        after(async () => {
            await pool.queryParam_Parse(
                'DELETE FROM like_perfume WHERE user_idx = ? AND perfume_idx = ?',
                [1, 1]
            );
        });
    });
});
