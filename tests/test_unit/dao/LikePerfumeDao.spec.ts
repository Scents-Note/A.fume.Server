import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import {
    DuplicatedEntryError,
    NotMatchedError,
    UnExpectedError,
} from '@errors';

import LikePerfumeDao from '@dao/LikePerfumeDao';

const likePerfumeDao = new LikePerfumeDao();
import { LikePerfume } from '@sequelize';

describe('# likePerfumeDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe('# create Test', () => {
        before(async () => {
            await LikePerfume.destroy({ where: { userIdx: 5, perfumeIdx: 5 } });
        });
        it('# success case', () => {
            likePerfumeDao
                .create(5, 5)
                .then((result: { userIdx: number; perfumeIdx: number }) => {
                    expect(result.userIdx).to.be.eq(5);
                    expect(result.perfumeIdx).to.be.eq(5);
                });
        });
        it('# DuplicatedEntryError case', () => {
            likePerfumeDao.create(5, 5).catch((err: Error) => {
                expect(err).instanceOf(DuplicatedEntryError);
            });
        });
        after(async () => {
            await LikePerfume.destroy({ where: { userIdx: 5, perfumeIdx: 5 } });
        });
    });

    describe('# read case', () => {
        it('# success case (state: like)', () => {
            likePerfumeDao
                .read(1, 1)
                .then((result: { userIdx: number; perfumeIdx: number }) => {
                    expect(result.userIdx).eq(1);
                    expect(result.perfumeIdx).eq(1);
                });
        });

        it('# success case (state: unlike)', () => {
            likePerfumeDao.read(2, 2).catch((err: Error) => {
                expect(err).instanceOf(NotMatchedError);
            });
        });

        it('# fail case (invalid userIdx)', () => {
            likePerfumeDao.read(-1, 1).catch((err: Error) => {
                expect(err).to.be.instanceOf(NotMatchedError);
            });
        });

        it('# fail case (invalid perfumeIdx)', (done: Done) => {
            likePerfumeDao
                .read(1, -1)
                .then((_: { userIdx: number; perfumeIdx: number }) => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err: Error) => {
                    expect(err).to.be.instanceOf(NotMatchedError);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# success case', () => {
            likePerfumeDao.readLikeInfo(1, [1, 2, 3, 4, 5]).then((result) => {
                expect(result.length).gte(5);
                for (const likePerfume of result) {
                    expect(likePerfume.userIdx).to.eq(1);
                    expect(likePerfume.perfumeIdx).to.be.oneOf([1, 2, 3, 4, 5]);
                }
            });
        });
    });

    describe('# delete Test', () => {
        before(async () => {
            await LikePerfume.upsert({
                userIdx: 5,
                perfumeIdx: 5,
            });
        });
        it('# success case', (done: Done) => {
            likePerfumeDao
                .delete(5, 5)
                .then((result: number) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# fail case (not like state)', (done: Done) => {
            likePerfumeDao
                .delete(5, 15)
                .then(() => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err: Error) => {
                    expect(err).to.be.instanceOf(NotMatchedError);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# fail case (invalid argument)', (done: Done) => {
            likePerfumeDao
                .delete(-5, 15)
                .then(() => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err: Error) => {
                    expect(err).to.be.instanceOf(NotMatchedError);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        after(async () => {
            await LikePerfume.destroy({ where: { userIdx: 5, perfumeIdx: 5 } });
        });
    });
});
