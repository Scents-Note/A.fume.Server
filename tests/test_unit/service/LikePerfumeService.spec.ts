import { expect } from 'chai';

import LikePerfumeDao from '@src/dao/LikePerfumeDao';
import { LikePerfumeService } from '@src/service/LikePerfumeService';
import { NotMatchedError } from '@src/utils/errors/errors';

const mockLikePerfumeDao = {} as LikePerfumeDao;
const LikePerfume: LikePerfumeService = new LikePerfumeService(
    mockLikePerfumeDao
);

describe('# Perfume Service Test', () => {
    describe('# like Test', () => {
        it('# likePerfume Test (좋아요)', () => {
            mockLikePerfumeDao.read = async (_: number, __: number) => {
                throw new NotMatchedError();
            };
            mockLikePerfumeDao.delete = async (_: number, __: number) => {
                return 0;
            };
            mockLikePerfumeDao.create = async (_: number, __: number) => {
                return { userIdx: -1, perfumeIdx: -1 };
            };
            LikePerfume.likePerfume(1, 1).then((result: boolean) => {
                expect(result).to.be.true;
            });
        });

        it('# likePerfume Test (좋아요 취소)', () => {
            mockLikePerfumeDao.read = async (_: number, __: number) => {
                return { userIdx: 1, perfumeIdx: 1 };
            };
            mockLikePerfumeDao.delete = async (_: number, __: number) => {
                return 0;
            };
            mockLikePerfumeDao.create = async (_: number, __: number) => {
                return { userIdx: 1, perfumeIdx: 1 };
            };
            LikePerfume.likePerfume(1, 1).then((result: boolean) => {
                expect(result).to.be.false;
            });
        });
    });
});
