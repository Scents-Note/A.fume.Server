const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const wishlistDao = require('../../dao/WishlistDao.js');
const { NotMatchedError } = require('../../utils/errors/errors.js');
const { sequelize, Wishlist } = require('../../models');

describe('# wishlistDao Test', () => {
    before(async () => {
        await sequelize.sync();
        await require('./seeds.js')();
    });
    describe(' # create Test', () => {
        before(async () => {
            await Wishlist.destroy({ where: { perfumeIdx: 1, userIdx: 1 } });
        });
        it('# success case', (done) => {
            wishlistDao
                .create(1, 1, 4)
                .then((result) => {
                    expect(result).to.not.be.null;
                    done();
                })
                .catch((err) => done(err));
        });
        it(' # DuplicatedEntryError case', (done) => {
            wishlistDao
                .create(1, 1, 4)
                .then(() => {
                    expect(false).true();
                    done();
                })
                .catch((err) => {
                    expect(err.parent.errno).eq(1062);
                    expect(err.parent.code).eq('ER_DUP_ENTRY');
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Wishlist.destroy({ where: { perfumeIdx: 1, userIdx: 1 } });
        });
    });

    describe(' # read Test', () => {
        describe(' # readByUserIdx Test', () => {
            before(async () => {
                await Wishlist.upsert({
                    userIdx: 2,
                    priority: 1,
                    perfumeIdx: 1,
                });
                await Wishlist.upsert({
                    userIdx: 2,
                    priority: 2,
                    perfumeIdx: 2,
                });
                await Wishlist.upsert({
                    userIdx: 2,
                    priority: 3,
                    perfumeIdx: 3,
                });
            });
            it('# success case', (done) => {
                wishlistDao
                    .readByUserIdx(2)
                    .then((result) => {
                        expect(result.length).to.greaterThan(2);
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
        describe('# readByPK Test', () => {
            before(async () => {
                await Wishlist.upsert({
                    userIdx: 2,
                    priority: 1,
                    perfumeIdx: 3,
                });
            });
            it('# success case', (done) => {
                wishlistDao
                    .readByPK(3, 2)
                    .then((result) => {
                        expect(result.userIdx).eq(2);
                        expect(result.perfumeIdx).eq(3);
                        expect(result.priority).eq(1);
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('# Not Matched case', (done) => {
                wishlistDao
                    .readByPK(1, 3)
                    .then(() =>
                        done(new Error('must be expected NotMatchedError'))
                    )
                    .catch((err) => {
                        expect(err).instanceOf(NotMatchedError);
                        done();
                    });
            });
        });
    });

    describe('# update Test', () => {
        before(async () => {
            await Wishlist.upsert({ userIdx: 1, priority: 1, perfumeIdx: 1 });
        });
        it('# success case', (done) => {
            wishlistDao
                .update(1, 1, 10)
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Wishlist.destroy({ where: { userIdx: 1, perfumeIdx: 1 } });
        });
    });
    describe('# delete Test', () => {
        before(async () => {
            await Wishlist.upsert({ perfumeIdx: 1, userIdx: 2, priority: 4 });
            await Wishlist.upsert({ perfumeIdx: 1, userIdx: 1, priority: 4 });
            await Wishlist.upsert({ perfumeIdx: 2, userIdx: 1, priority: 5 });
            await Wishlist.upsert({ perfumeIdx: 3, userIdx: 1, priority: 3 });
            await Wishlist.upsert({ perfumeIdx: 4, userIdx: 1, priority: 2 });
            await Wishlist.upsert({ perfumeIdx: 5, userIdx: 1, priority: 1 });
        });
        describe('# delete Test', () => {
            it('# success case', (done) => {
                wishlistDao
                    .delete(1, 2)
                    .then((result) => {
                        expect(result).eq(1);
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
        describe('# delete by user_idx Test', () => {
            it('# success case(delete by user id)', (done) => {
                wishlistDao
                    .deleteByUserIdx(1)
                    .then((result) => {
                        expect(result).eq(5);
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
        after(async () => {
            await Wishlist.destroy({ where: { userIdx: 1 } });
        });
    });
});
