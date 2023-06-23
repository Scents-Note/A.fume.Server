import dotenv from 'dotenv';
dotenv.config();

import { expect } from 'chai';

import * as converter from '@utils/converter';

describe('# converter Test', () => {
    it(' # Input Int < - > DB Int Test', () => {
        Promise.all(
            [0, 1, 2, 3, 4, 5].map(async (idx) => {
                const longevity = Math.min(idx, 5);
                const sillage = Math.min(idx, 3);
                const seasonal = parseInt(String(Math.random() * 100)) % 16;
                const gender = Math.min(idx, 3);
                const keywordList = [1, 2, 3, 4, 5];
                const result = converter.DBIntToOutputIntOfReview({
                    longevity,
                    sillage,
                    sumOfBitSeasonal: seasonal,
                    gender,
                });
                expect(result.longevity).to.be.not.null;
                expect(result.sillage).to.be.not.null;
                expect(result.seasonalList).to.be.instanceof(Array);
                expect(result.gender).to.be.not.null;

                const recover = await converter.InputIntToDBIntOfReview({
                    ...result,
                    keywordList,
                });
                expect(recover.longevity).to.be.eq(longevity);
                expect(recover.sillage).to.be.eq(sillage);
                expect(recover.sumOfBitSeasonal).to.be.eq(seasonal);
                expect(recover.gender).to.be.eq(gender);
                expect(recover.keywordList).to.be.deep.eq(keywordList);
            })
        );
    });

    it(' # Input Int < - > DB Int Zero Test', async () => {
        const longevity = null;
        const sillage = null;
        const seasonal = null;
        const gender = null;
        const keywordList: number[] = [];
        const result = converter.DBIntToOutputIntOfReview({
            longevity,
            sillage,
            sumOfBitSeasonal: seasonal,
            gender,
        });
        expect(result.longevity).to.be.not.null;
        expect(result.sillage).to.be.not.null;
        expect(result.seasonalList).to.be.instanceof(Array);
        expect(result.gender).to.be.not.null;
        const recover = await converter.InputIntToDBIntOfReview({
            ...result,
            keywordList,
        });
        expect(recover.longevity).to.be.eq(longevity);
        expect(recover.sillage).to.be.eq(sillage);
        expect(recover.sumOfBitSeasonal).to.be.eq(seasonal);
        expect(recover.gender).to.be.eq(gender);
        expect(recover.keywordList).to.be.deep.eq(keywordList);
    });
    describe(' # ApproxAge Test', () => {
        it(' # 20대 테스트', () => {
            const thisYear = new Date().getFullYear();
            for (let age = 20; age <= 23; age++) {
                const it = converter.getApproxAge(thisYear - age + 1);
                expect(it).to.be.eq('20대 초반');
            }

            for (let age = 24; age <= 26; age++) {
                const it = converter.getApproxAge(thisYear - age + 1);
                expect(it).to.be.eq('20대 중반');
            }
            for (let age = 27; age <= 29; age++) {
                const it = converter.getApproxAge(thisYear - age + 1);
                expect(it).to.be.eq('20대 후반');
            }
        });

        it(' # 30대 테스트', () => {
            const thisYear = new Date().getFullYear();
            for (let age = 37; age <= 39; age++) {
                const it = converter.getApproxAge(thisYear - age + 1);
                expect(it).to.be.eq('30대 후반');
            }
        });

        it(' # 50대 테스트', () => {
            const thisYear = new Date().getFullYear();
            for (let age = 50; age <= 53; age++) {
                const it = converter.getApproxAge(thisYear - age + 1);
                expect(it).to.be.eq('50대 초반');
            }
        });

        it(' # 0대 테스트', () => {
            const thisYear = new Date().getFullYear();
            for (let age = 0; age <= 3; age++) {
                const it = converter.getApproxAge(thisYear - age + 1);
                expect(it).to.be.eq('0대 초반');
            }
            for (let age = 4; age <= 6; age++) {
                const it = converter.getApproxAge(thisYear - age + 1);
                expect(it).to.be.eq('0대 중반');
            }
            for (let age = 7; age <= 9; age++) {
                const it = converter.getApproxAge(thisYear - age + 1);
                expect(it).to.be.eq('0대 후반');
            }
        });

        it(' # 100대 테스트', () => {
            const thisYear = new Date().getFullYear();
            for (let age = 100; age <= 103; age++) {
                const it = converter.getApproxAge(thisYear - age + 1);
                expect(it).to.be.eq('100대 초반');
            }
            for (let age = 104; age <= 106; age++) {
                const it = converter.getApproxAge(thisYear - age + 1);
                expect(it).to.be.eq('100대 중반');
            }
            for (let age = 107; age <= 109; age++) {
                const it = converter.getApproxAge(thisYear - age + 1);
                expect(it).to.be.eq('100대 후반');
            }
        });
    });
});
