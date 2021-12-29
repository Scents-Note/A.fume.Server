import { expect } from 'chai';
import PerfumeIntegralDTO from '../../../src/data/dto/PerfumeIntegralDTO';

class PerfumeIntegralMockHelper {
    static validTest(this: PerfumeIntegralDTO) {
        expect(this.brandName).to.be.ok;
        expect(this.isLiked).to.be.true;
        expect(this.story).to.be.ok;
        if (this.noteType == 1) {
            expect(this.noteDict.top).be.empty;
            expect(this.noteDict.middle).be.empty;
            expect(this.noteDict.base).be.empty;
            expect(this.noteDict.single).be.ok;
        } else {
            expect(
                [
                    this.noteDict.top,
                    this.noteDict.middle,
                    this.noteDict.base,
                ].filter((it: string) => it.length > 0).length
            ).be.gt(0);
            expect(this.noteDict.single).be.empty;
        }
        expect(this.score).to.be.gte(0);

        const sumOfMapFunc = (map: { [key: string]: number }) => {
            let sum = 0;
            for (const key in map) {
                sum += map[key];
            }
            return sum;
        };
        expect(this.seasonal).to.be.ok;
        expect(sumOfMapFunc(this.seasonal)).to.be.eq(100);
        expect(this.longevity).to.be.ok;
        expect(sumOfMapFunc(this.longevity)).to.be.eq(100);
        expect(this.gender).to.be.ok;
        expect(sumOfMapFunc(this.gender)).to.be.eq(100);
        expect(this.reviewIdx).to.be.gte(0);
    }

    static createMock(condition: any): PerfumeIntegralDTO {
        return PerfumeIntegralDTO.createByJson(
            Object.assign(
                {
                    perfumeIdx: 1,
                    name: '향수1',
                    brandName: '브랜드1',
                    story: '스토리1',
                    abundanceRate: '오 드 코롱',
                    volumeAndPrice: [],
                    isLiked: false,
                    keywordList: ['keyword', 'keyword2'],
                    imageUrls: [],
                    noteType: 0,
                    noteDict: {
                        top: '재료1, 재료1, 재료1, 재료1',
                        middle: '재료1',
                        base: '',
                        single: '',
                    },
                    score: 1,
                    seasonal: {
                        spring: 15,
                        summer: 0,
                        fall: 78,
                        winter: 7,
                    },
                    sillage: {
                        light: 7,
                        medium: 86,
                        heavy: 7,
                    },
                    longevity: {
                        veryWeak: 93,
                        weak: 0,
                        normal: 0,
                        strong: 7,
                        veryStrong: 0,
                    },
                    gender: {
                        male: 7,
                        neutral: 7,
                        female: 86,
                    },
                },
                condition
            )
        );
    }
}

export default PerfumeIntegralMockHelper;
