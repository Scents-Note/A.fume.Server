'use strict';
const { expect } = require('chai');

const PerfumeThumbDTO = require('../../../src/data/dto/PerfumeThumbDTO');

PerfumeThumbDTO.validTest = function () {
    expect(this.perfumeIdx).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.brandName).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.isLiked).to.be.oneOf([true, false]);
};

PerfumeThumbDTO.createMock = (condition) => {
    return new PerfumeThumbDTO(
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
};

PerfumeThumbDTO.createWithIdx = (idx) => {
    return new PerfumeThumbDTO({
        perfumeIdx: idx,
        name: `perfume${idx}`,
        imageUrl: `https://afume.s3.ap-northeast-2.amazonaws.com/perfume/2475/${idx}.jpg`,
        brandName: `브랜드 ${idx}`,
        isLiked: false,
    });
};

module.exports = PerfumeThumbDTO;
