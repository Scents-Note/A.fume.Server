'use strict';

const PerfumeThumbDTO = require('../../../data/dto/PerfumeThumbDTO');

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
