import { expect } from 'chai';
import PerfumeThumbKeywordDTO from '../../../src/data/dto/PerfumeThumbKeywordDTO';

class PerfumeThumbKeywordMockHelper {
    static validTest(this: PerfumeThumbKeywordDTO) {
        expect(this.perfumeIdx).to.be.ok;
        expect(this.name).to.be.ok;
        expect(this.brandName).to.be.ok;
        expect(this.imageUrl).to.be.ok;
        expect(this.isLiked).to.be.oneOf([true, false]);
        expect(this.keywordList).to.be.a('array');
    }

    static createMock(condition: any): PerfumeThumbKeywordDTO {
        return PerfumeThumbKeywordDTO.createByJson(
            Object.assign(
                {
                    perfumeIdx: 2475,
                    name: 'White Patchouli Tom Ford for women',
                    imageUrl:
                        'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2475/1.jpg',
                    brandName: '톰 포드',
                    isLiked: false,
                    keywordList: ['KEYWORD 1', 'KEYWORD2'],
                },
                condition
            )
        );
    }

    static createWithIdx(
        idx: number,
        keywordList: string[]
    ): PerfumeThumbKeywordDTO {
        return PerfumeThumbKeywordDTO.createByJson({
            perfumeIdx: idx,
            name: `perfume${idx}`,
            imageUrl: `https://afume.s3.ap-northeast-2.amazonaws.com/perfume/${idx}/1.jpg`,
            brandName: `브랜드`,
            isLiked: false,
            keywordList,
        });
    }
}

export default PerfumeThumbKeywordMockHelper;
