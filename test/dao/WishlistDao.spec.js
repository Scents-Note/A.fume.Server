const dotenv = require('dotenv');
dotenv.config({path: './config/.env.tst'});

const chai = require('chai');
const { expect } = chai;
const wishlistDao = require('../../dao/WishlistDao.js');
const { DuplicatedEntryError, NotMatchedError } = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');

describe('# wishlistDao Test', () => {
    describe(' # create Test', () => {
        before(async () => {
            await pool.queryParam_Parse('DELETE FROM wishlist WHERE perfume_idx = ? AND user_idx = ?', [1, 1]);
        });
        it('# success case', (done) => {
            wishlistDao.create(1, 1, 4).then((result) => {
                expect(result).gt(0);
                done();
            });
        });
        it(' # DuplicatedEntryError case', (done) => {
            wishlistDao.create(1, 1, 4)
            .then(() => {
                expect(false).true();
                done();
            }).catch((err) => {
                expect(err).instanceOf(DuplicatedEntryError);
                done();
            });
        });
        after(async() => {
            await pool.queryParam_Parse('DELETE FROM wishlist WHERE perfume_idx = ? AND user_idx = ?', [1, 1]);
        });
    });
    
    describe(' # read Test', () => {    
        describe(' # readByUserIdx Test', () => {
            it('# success case', (done) => {
                wishlistDao.readByUserIdx(2)
                .then((result) => {
                    expect(result.length).eq(3);
                    done();
                });
            });
        });
        describe(' # readByPK Test', () => {
            it('# success case', (done) => {
                wishlistDao.readByPK(3, 2)
                .then((result) => {
                    expect(result.userIdx).eq(2);
                    expect(result.perfumeIdx).eq(3);
                    expect(result.priority).eq(1);
                    done();
                });
            });
            it('# Not Matched case', (done) => {
                wishlistDao.readByPK(3, 1)
                .then(() => {
                    expect(false).true();
                    done();
                }).catch((err) => {
                    expect(err).instanceOf(NotMatchedError);
                    done();
                });
            });
        });
    });

    describe('# update Test', () => {
        before(async () => {
            await pool.queryParam_Parse('INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE priority = ?', [1, 1, 5, 5]);
        });
        it('# success case', (done) => {
            wishlistDao.update(1, 1, 10)
            .then((result) => {
                expect(result).eq(1);
                done();
            });
        });
        after(async() => {
            await pool.queryParam_Parse('DELETE FROM wishlist WHERE perfume_idx = ? AND user_idx = ?', [1, 1]);
        });
    });
    describe('# delete Test', () => {
        before(async () => {
            await pool.queryParam_Parse('INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE priority = ?', [1, 1, 5, 5]);
            await pool.queryParam_Parse('INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE priority = ?', [2, 1, 5, 5]);
            await pool.queryParam_Parse('INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE priority = ?', [3, 1, 5, 5]);
            await pool.queryParam_Parse('INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE priority = ?', [4, 1, 5, 5]);
            await pool.queryParam_Parse('INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE priority = ?', [5, 1, 5, 5]);
            await pool.queryParam_Parse('INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE priority = ?', [6, 1, 5, 5]);
        });
        describe('# delete Test', () => {
            it('# success case', (done) => {
                wishlistDao.delete(1, 1)
                .then((result) => {
                    expect(result).eq(1);
                    done();
                });
            });
        });
        describe('# delete by user_idx Test', () => {
            it('# success case(delete by user id)', (done) => {
                wishlistDao.deleteByUserIdx(1)
                .then((result) => {
                    expect(result).eq(5);
                    done();
                });
            });
        });
        after(async() => {
            await pool.queryParam_Parse('DELETE FROM wishlist WHERE user_idx = ?', [1]);
        });
    });
});
