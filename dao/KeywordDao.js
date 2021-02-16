const {NotMatchedError} = require('../utils/errors/errors.js')
const { Keyword, Perfume } = require('../models');

/**
 * 키워드 전체 목록 조회
 *
 * @returns {Promise<Keyword[]>}
 */
//LIMIT는 가져올 게시물의 수, OFFSET은 어디서부터 가져올거냐(몇 페이지를 가져오고 싶냐)
module.exports.readAll = (pagingIndex, pagingSize) => {
    return Keyword.findAndCountAll({ 
        attributes: {
            exclude: [
                'createdAt',
                'updatedAt'
            ]
        },
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        raw: true,
        nest: true
    });
};

/**
 * 향수별 키워드 목록 조회
 *
 * @param {number} [perfumeIdx = -1]
 * @returns {Promise<Keyword[]>} keywordList
 */ 
module.exports.readAllOfPerfume = async (perfumeIdx) => {
    let result =  await Keyword.findAll({ 
        attributes: {
            exclude: [
                'createdAt',
                'updatedAt'
            ]
        },
        include: {
            model: Perfume,
            where: {perfumeIdx}
        },
        raw: true, //Set this to true if you don't have a model definition for your query.
        nest: true
    });
    
    if (!result || result.length === 0) {
        throw new NotMatchedError();
    }

    return result.map((it) => {
        delete it.Perfumes;
        return it;
    });
};
