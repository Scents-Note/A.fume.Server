import { expect } from 'chai';
import PerfumeThumbDTO from '../../src/data/dto/PerfumeThumbDTO';
import BrandHelper from './BrandHelper';

class PerfumeThumbMockHelper {
    static validTest(this: PerfumeThumbDTO) {
        expect(this.perfumeIdx).to.be.ok;
        expect(this.name).to.be.ok;
        expect(this.brandName).to.be.ok;
        expect(this.imageUrl).to.be.ok;
        expect(this.isLiked).to.be.oneOf([true, false]);
        expect(this.createdAt).to.be.ok;
        expect(this.updatedAt).to.be.ok;
    }
    static createMock(condition: any): PerfumeThumbDTO {
        return PerfumeThumbDTO.createByJson(
            Object.assign(
                {
                    perfumeIdx: 2475,
                    name: 'White Patchouli Tom Ford for women',
                    imageUrl:
                        'https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2475/1.jpg',
                    isLiked: false,
                    Brand: BrandHelper.create({ name: '톰 포드' }),
                },
                condition
            )
        );
    }

    static createWithIdx(idx: number): PerfumeThumbDTO {
        return PerfumeThumbDTO.createByJson({
            perfumeIdx: idx,
            name: `perfume${idx}`,
            imageUrl: `https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2475/${idx}.jpg`,
            isLiked: false,
            Brand: BrandHelper.createWithIdx(idx),
        });
    }
}

export default PerfumeThumbMockHelper;
