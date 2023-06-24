import { expect } from 'chai';

import { DuplicatedEntryError, NotMatchedError } from '@errors';

import LikeReviewDao from '@dao/LikeReviewDao';
const likeReviewDao = new LikeReviewDao();

import { LikeReview } from '@sequelize';

describe('# LikeReviewDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe('# create Test', () => {
        before(async () => {
            // const before = await LikeReview.findOne({
            //     where: { userIdx: 1, reviewIdx: 2 },
            //     raw: true,
            //     nest: true,
            // });
            // console.log('likeReview create before result: ', before)
            await LikeReview.destroy({ where: { userIdx: 1, reviewIdx: 2 } });
            // const after = await LikeReview.findOne({
            //     where: { userIdx: 1, reviewIdx: 2 },
            //     raw: true,
            //     nest: true,
            // });
            // console.log('likeReview create after result: ', after)
        });
        it('# success case', async () => {
            const result = await likeReviewDao.create(1, 2);
            const likeReview = result[0];
            const updateLikeCnt = result[1];
            expect(likeReview.userIdx).eq(1);
            expect(likeReview.reviewIdx).eq(2);
            expect(updateLikeCnt[0]).eq(1);
        });

        it('# fail case (duplicated)', async () => {
            try {
                await likeReviewDao.create(1, 2);
            } catch (err) {
                expect(err).instanceOf(DuplicatedEntryError);
            }
        });

        it('# fail case (invalid userIdx)', async () => {
            try {
                await likeReviewDao.create(-1, 2);
            } catch (err) {
                expect(err).instanceOf(NotMatchedError);
            }
        });

        it('# fail case (invalid reviewIdx)', async () => {
            try {
                await likeReviewDao.create(1, -2);
            } catch (err) {
                expect(err).instanceOf(NotMatchedError);
            }
        });

        after(async () => {
            await LikeReview.destroy({ where: { userIdx: 1, reviewIdx: 2 } });
            await LikeReview.destroy({ where: { userIdx: -1, reviewIdx: 2 } });
            await LikeReview.destroy({ where: { userIdx: -1, reviewIdx: -2 } });
        });
    });

    describe('# read case', () => {
        it('# success case', async () => {
            const result = await likeReviewDao.read(1, 1);
            expect(result?.userIdx).eq(1);
            expect(result?.reviewIdx).eq(1);
        });
    });

    describe('# delete Test', () => {
        before(async () => {
            await likeReviewDao.create(3, 1);
        });

        it('# success case', async () => {
            const result = await likeReviewDao.delete(3, 1);
            expect(result[0]).eq(1);
            expect(result[1][0]).eq(1);
        });
    });
});
