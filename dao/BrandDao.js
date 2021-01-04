const {
    NotMatchedError,
} = require('../utils/errors/errors.js');

const { Brand } = require('../models');

/**
 * 브랜드 생성
 * 
 * @param {Object} brand
 * @param {Promise}
 * @returns {integer} brandIdx
 */
module.exports.create = async ({
    name,
    englishName,
    startCharacter,
    imageUrl,
    description
}) => {
    const brand = await Brand.create({name, englishName, startCharacter, imageUrl, description})
    return brand.dataValues.brandIdx;
};

/**
 * 브랜드 세부 조회 
 * 
 * @param {number} brandIdx
 * @returns {Promise<Brand>}
 */
module.exports.read = async (brandIdx) => {
    const result = await Brand.findByPk(brandIdx);
    if(!result) {
        throw new NotMatchedError();
    }
    return result.dataValues;
};

/**
 * 브랜드 전체 목록 조회
 * 
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @param {array} order
 * @returns {Promise<Brand[]>}
 */
module.exports.readAll = async (pagingIndex, pagingSize, order) => {
    return Brand.findAll({ 
        offset: (pagingIndex - 1) * pagingSize, 
        limit: pagingSize, 
        order
    });
};

/**
 * 브랜드 수정
 * 
 * @param {Object} Brand
 * @return {Promise}
 */
module.exports.update = async ({
    brandIdx,
    name,
    englishName,
    startCharacter,
    imageUrl,
    description
}) => {
    const [ affectedRows ] = await Brand.update({name, englishName, startCharacter, imageUrl, description}, { where: {brandIdx} });
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};

/**
 * 브랜드 전체 삭제
 * 
 * @param {number} brandIdx
 * @returns {Promise}
 */
module.exports.delete = (brandIdx) => {
    return Brand.destroy({ where: { brandIdx }});
};