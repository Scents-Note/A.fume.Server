import { expect } from 'chai';
import PerfumeThumbDTO from '../../../src/data/dto/PerfumeThumbDTO';

class PerfumeThumbMockHelper {
    static validTest(this: PerfumeThumbDTO) {
        expect(this.perfumeIdx).to.be.ok;
        expect(this.name).to.be.ok;
        expect(this.brandName).to.be.ok;
        expect(this.imageUrl).to.be.ok;
        expect(this.isLiked).to.be.oneOf([true, false]);
    }
    static createMock(condition: any) {
        return PerfumeThumbDTO.createByJson(
            Object.assign(
                {
                    perfumeIdx: 2475,
                    name: 'White Patchouli Tom Ford for women',
                    imageUrl:
                        'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2475/1.jpg',
                    brandName: '톰 포드',
                    isLiked: false,
                },
                condition
            )
        );
    }

    static createWithIdx(idx: number) {
        return PerfumeThumbDTO.createByJson({
            perfumeIdx: idx,
            name: `perfume${idx}`,
            imageUrl: `https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2475/${idx}.jpg`,
            brandName: `브랜드 ${idx}`,
            isLiked: false,
        });
    }
}

export default PerfumeThumbMockHelper;
