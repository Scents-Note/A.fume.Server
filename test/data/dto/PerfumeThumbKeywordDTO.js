'use strict';

const { expect } = require('chai');
const PerfumeThumbKeywordDTO = require('../../../src/data/dto/PerfumeThumbKeywordDTO');

PerfumeThumbKeywordDTO.validTest = function () {
    expect(this.perfumeIdx).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.brandName).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.isLiked).to.be.oneOf([true, false]);
    expect(this.keywordList).to.be.a('array');
};

PerfumeThumbKeywordDTO.createMock = (condition) => {
    return new PerfumeThumbKeywordDTO(
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
};

PerfumeThumbKeywordDTO.createWithIdx = (idx, keywordList) => {
    return new PerfumeThumbKeywordDTO({
        perfumeIdx: idx,
        name: `perfume${idx}`,
        imageUrl: `https://afume.s3.ap-northeast-2.amazonaws.com/perfume/${idx}/1.jpg`,
        brandName: `브랜드`,
        isLiked: false,
        keywordList,
    });
};

module.exports = PerfumeThumbKeywordDTO;
