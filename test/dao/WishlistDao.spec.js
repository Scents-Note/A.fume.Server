const chai = require('chai');
const { expect } = chai;
const wishlistDao = require('../../dao/WishlistDao.js');
const { DuplicatedEntryError, NotMatchedError } = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');

describe('# wishlistDao Test', () => {
    describe(' # create Test', () => {
        before(async () => {
            await pool.queryParam_Parse("DELETE FROM wishlist WHERE perfume_idx = ? AND user_idx = ?", [1, 1]);
        });
        it('# success case', (done) => {
            wishlistDao.create({perfume_idx: 1, user_idx: 1, priority: 4}).then((result) => {
                expect(result.affectedRows).eq(1);
                done();
            });
        });
        it(' # DuplicatedEntryError case', (done) => {
            wishlistDao.create({perfume_idx: 1, user_idx: 1, priority: 4})
            .then((result) => {
                expect(false).true();
                done();
            }).catch((err) => {
                expect(err).instanceOf(DuplicatedEntryError);
                done();
            });
        });
        after(async() => {
            await pool.queryParam_Parse("DELETE FROM wishlist WHERE perfume_idx = ? AND user_idx = ?", [1, 1]);
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
                wishlistDao.readByPK({user_idx: 2, perfume_idx: 3})
                .then((result) => {
                    expect(result.user_idx).eq(2);
                    expect(result.perfume_idx).eq(3);
                    expect(result.priority).eq(1);
                    done();
                });
            });
            it('# Not Matched case', (done) => {
                wishlistDao.readByPK({user_idx: 1, perfume_idx: 3})
                .then((result) => {
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
            await pool.queryParam_Parse("INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE priority = ?", [1, 1, 5, 5]);
        });
        it('# success case', (done) => {
            wishlistDao.update({perfume_idx: 1, user_idx: 1, priority: 10})
            .then((result) => {
                expect(result.affectedRows).eq(1);
                done();
            });
        });
        after(async() => {
            await pool.queryParam_Parse("DELETE FROM wishlist WHERE perfume_idx = ? AND user_idx = ?", [1, 1]);
        });
    });
    describe('# delete Test', () => {
        before(async () => {
            await pool.queryParam_Parse("INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?)", [1, 1, 5]);
            await pool.queryParam_Parse("INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?)", [2, 1, 5]);
            await pool.queryParam_Parse("INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?)", [3, 1, 5]);
            await pool.queryParam_Parse("INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?)", [4, 1, 5]);
            await pool.queryParam_Parse("INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?)", [5, 1, 5]);
            await pool.queryParam_Parse("INSERT INTO wishlist(perfume_idx, user_idx, priority) VALUES(?, ?, ?)", [6, 1, 5]);
        });
        describe('# delete Test', () => {
            it('# success case', (done) => {
                wishlistDao.delete({user_idx: 1, perfume_idx: 1})
                .then((result) => {
                    expect(result.affectedRows).eq(1);
                    done();
                });
            });
        });
        describe('# delete by user_idx Test', () => {
            it('# success case(delete by user id)', (done) => {
                wishlistDao.deleteByUserIdx(1)
                .then((result) => {
                    expect(result.affectedRows).eq(5);
                    done();
                });
            });
        });
        after(async() => {
            await pool.queryParam_Parse("DELETE FROM wishlist WHERE user_idx = ?", [1]);
        });
    });
});
