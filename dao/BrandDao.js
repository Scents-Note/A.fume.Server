const {
    NotMatchedError,
    DuplicatedEntryError,
} = require('../utils/errors/errors.js');

const { Brand } = require('../models');

/**
 * 브랜드 생성
 *
 * @param {Object} brand
 * @param {Promise}
 * @returns {integer} brandIdx
 */
module.exports.create = ({
    name,
    englishName,
    firstInitial,
    imageUrl,
    description,
}) => {
    return Brand.create(
        {
            name,
            englishName,
            firstInitial,
            imageUrl,
            description,
        },
        { nest: true, raw: true }
    )
        .then((brand) => {
            return brand.brandIdx;
        })
        .catch((err) => {
            if (
                err.parent.errno === 1062 ||
                err.parent.code === 'ER_DUP_ENTRY'
            ) {
                throw new DuplicatedEntryError();
            }
            throw err;
        });
};

/**
 * 브랜드 세부 조회
 *
 * @param {number} brandIdx
 * @returns {Promise<Brand>}
 */
module.exports.read = async (brandIdx) => {
    const result = await Brand.findByPk(brandIdx, {
        nest: true,
        raw: true,
    });
    if (!result) {
        throw new NotMatchedError();
    }
    return result;
};

/**
 * 브랜드 검색
 *
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @param {array} order
 * @returns {Promise<Brand[]>}
 */
module.exports.search = (pagingIndex, pagingSize, order) => {
    return Brand.findAndCountAll({
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        order,
        raw: true,
        nest: true,
    });
};

/**
 * 브랜드 전체 목록 조회
 *
 * @returns {Promise<Brand[]>}
 */
module.exports.readAll = async () => {
    return Brand.findAndCountAll({
        raw: true,
        nest: true,
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
    firstInitial,
    imageUrl,
    description,
}) => {
    const [affectedRows] = await Brand.update(
        {
            name,
            englishName,
            firstInitial,
            imageUrl,
            description,
        },
        { where: { brandIdx } }
    );
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
    return Brand.destroy({ where: { brandIdx } });
};

/**
 * 브랜드 검색
 *
 * @param {Object} condition
 * @returns {Promise<Brand>}
 */
module.exports.findBrand = (condition) => {
    return Brand.findOne({
        where: condition,
        nest: true,
        raw: true,
    }).then((it) => {
        if (!it) {
            throw new NotMatchedError();
        }
        return it;
    });
};
