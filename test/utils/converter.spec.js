const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;

const converter = require('@utils/converter.js');

describe('# converter Test', () => {
    it(' # Input Str < - > DB Int Test', (done) => {
        Promise.all(
            [0, 1, 2, 3, 4, 5].map((idx) => {
                const longevity = Math.min(idx + 1, 5);
                const sillage = Math.min(idx + 1, 3);
                const seasonal = parseInt(Math.random() * 100) % 16;
                const gender = Math.min(idx + 1, 3);
                const keywordList = [...new Array(idx)].map((it, index) => {
                    return `키워드${index + 1}`;
                });
                const keywordIdxList = [...new Array(idx)].map((it, index) => {
                    return index + 1;
                });
                return converter
                    .DBIntToOutputStrOfReview({
                        longevity,
                        sillage,
                        sumOfBitSeasonal: seasonal,
                        gender,
                        keywordList,
                    })
                    .then((result) => {
                        expect(result.longevity).to.be.not.null;
                        expect(result.sillage).to.be.not.null;
                        expect(result.seasonalList).to.be.instanceof(Array);
                        expect(result.gender).to.be.not.null;
                        return converter.inputStrToDBIntOfReview({
                            ...result,
                            keywordList,
                        });
                    })
                    .then((recover) => {
                        expect(recover.longevity).to.be.eq(longevity);
                        expect(recover.sillage).to.be.eq(sillage);
                        expect(recover.sumOfBitSeasonal).to.be.eq(seasonal);
                        expect(recover.gender).to.be.eq(gender);
                        expect(recover.keywordList).to.be.deep.eq(
                            keywordIdxList
                        );
                    });
            })
        )
            .then((_) => {
                done();
            })
            .catch((err) => done(err));
    });

    it(' # Input Str < - > DB Int Zero Test', (done) => {
        const longevity = 0;
        const sillage = 0;
        const seasonal = 0;
        const gender = 0;
        const keywordList = [];
        converter
            .DBIntToOutputStrOfReview({
                longevity,
                sillage,
                sumOfBitSeasonal: seasonal,
                gender,
            })
            .then((result) => {
                expect(result.longevity).to.be.not.null;
                expect(result.sillage).to.be.not.null;
                expect(result.seasonalList).to.be.instanceof(Array);
                expect(result.gender).to.be.not.null;
                return converter.inputStrToDBIntOfReview({
                    ...result,
                    keywordList,
                });
            })
            .then((recover) => {
                expect(recover.longevity).to.be.eq(longevity);
                expect(recover.sillage).to.be.eq(sillage);
                expect(recover.sumOfBitSeasonal).to.be.eq(seasonal);
                expect(recover.gender).to.be.eq(gender);
                expect(recover.keywordList).to.be.deep.eq(keywordList);
                done();
            })
            .catch((err) => done(err));
    });

    it(' # Input Int < - > DB Int Test', (done) => {
        Promise.all(
            [0, 1, 2, 3, 4, 5].map((idx) => {
                const longevity = Math.min(idx, 5);
                const sillage = Math.min(idx, 3);
                const seasonal = parseInt(Math.random() * 100) % 16;
                const gender = Math.min(idx, 3);
                const keywordList = [1, 2, 3, 4, 5];
                converter
                    .DBIntToOutputIntOfReview({
                        longevity,
                        sillage,
                        sumOfBitSeasonal: seasonal,
                        gender,
                    })
                    .then((result) => {
                        expect(result.longevity).to.be.not.null;
                        expect(result.sillage).to.be.not.null;
                        expect(result.seasonalList).to.be.instanceof(Array);
                        expect(result.gender).to.be.not.null;
                        expect(result.keywordList).to.be.not.null;
                        return converter.InputIntToDBIntOfReview({
                            ...result,
                            keywordList,
                        });
                    })
                    .then((recover) => {
                        expect(recover.longevity).to.be.eq(longevity);
                        expect(recover.sillage).to.be.eq(sillage);
                        expect(recover.sumOfBitSeasonal).to.be.eq(seasonal);
                        expect(recover.gender).to.be.eq(gender);
                        expect(recover.keywordList).to.be.deep.eq(keywordList);
                    });
            })
        )
            .then((_) => {
                done();
            })
            .catch((err) => done(err));
    });

    it(' # Input Int < - > DB Int Zero Test', (done) => {
        const longevity = null;
        const sillage = null;
        const seasonal = null;
        const gender = null;
        const keywordList = [];
        converter
            .DBIntToOutputIntOfReview({
                longevity,
                sillage,
                sumOfBitSeasonal: seasonal,
                gender,
            })
            .then((result) => {
                expect(result.longevity).to.be.not.null;
                expect(result.sillage).to.be.not.null;
                expect(result.seasonalList).to.be.instanceof(Array);
                expect(result.gender).to.be.not.null;
                return converter.InputIntToDBIntOfReview({
                    ...result,
                    keywordList,
                });
            })
            .then((recover) => {
                expect(recover.longevity).to.be.eq(longevity);
                expect(recover.sillage).to.be.eq(sillage);
                expect(recover.sumOfBitSeasonal).to.be.eq(seasonal);
                expect(recover.gender).to.be.eq(gender);
                expect(recover.keywordList).to.be.deep.eq(keywordList);
                done();
            })
            .catch((err) => done(err));
    });
    describe(' # ApproxAge Test', () => {
        it(' # 20대 테스트', async () => {
            try {
                const thisYear = new Date().getFullYear();
                for (let age = 20; age <= 23; age++) {
                    const it = await converter.getApproxAge(thisYear - age + 1);
                    expect(it).to.be.eq('20대 초반');
                }

                for (let age = 24; age <= 26; age++) {
                    const it = await converter.getApproxAge(thisYear - age + 1);
                    expect(it).to.be.eq('20대 중반');
                }
                for (let age = 27; age <= 29; age++) {
                    const it = await converter.getApproxAge(thisYear - age + 1);
                    expect(it).to.be.eq('20대 후반');
                }
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });

        it(' # 30대 테스트', async () => {
            try {
                const thisYear = new Date().getFullYear();
                for (let age = 37; age <= 39; age++) {
                    const it = await converter.getApproxAge(thisYear - age + 1);
                    expect(it).to.be.eq('30대 후반');
                }
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });

        it(' # 50대 테스트', async () => {
            try {
                const thisYear = new Date().getFullYear();
                for (let age = 50; age <= 53; age++) {
                    const it = await converter.getApproxAge(thisYear - age + 1);
                    expect(it).to.be.eq('50대 초반');
                }
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });

        it(' # 0대 테스트', async () => {
            try {
                const thisYear = new Date().getFullYear();
                for (let age = 0; age <= 3; age++) {
                    const it = await converter.getApproxAge(thisYear - age + 1);
                    expect(it).to.be.eq('0대 초반');
                }
                for (let age = 4; age <= 6; age++) {
                    const it = await converter.getApproxAge(thisYear - age + 1);
                    expect(it).to.be.eq('0대 중반');
                }
                for (let age = 7; age <= 9; age++) {
                    const it = await converter.getApproxAge(thisYear - age + 1);
                    expect(it).to.be.eq('0대 후반');
                }
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });

        it(' # 100대 테스트', async () => {
            try {
                const thisYear = new Date().getFullYear();
                for (let age = 100; age <= 103; age++) {
                    const it = await converter.getApproxAge(thisYear - age + 1);
                    expect(it).to.be.eq('100대 초반');
                }
                for (let age = 104; age <= 106; age++) {
                    const it = await converter.getApproxAge(thisYear - age + 1);
                    expect(it).to.be.eq('100대 중반');
                }
                for (let age = 107; age <= 109; age++) {
                    const it = await converter.getApproxAge(thisYear - age + 1);
                    expect(it).to.be.eq('100대 후반');
                }
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });
    });
});
