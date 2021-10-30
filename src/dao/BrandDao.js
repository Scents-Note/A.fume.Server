const {
    NotMatchedError,
    DuplicatedEntryError,
} = require('../utils/errors/errors.js');

const { Brand } = require('../../models');
const { BrandDTO, ListAndCountDTO } = require('../data/dto');

/**
 * 브랜드 세부 조회
 *
 * @param {number} brandIdx
 * @returns {Promise<BrandDTO>}
 */
module.exports.read = async (brandIdx) => {
    const result = await Brand.findByPk(brandIdx, {
        nest: true,
        raw: true,
    });
    if (!result) {
        throw new NotMatchedError();
    }
    return new BrandDTO(result);
};

/**
 * 브랜드 검색
 *
 * @param {PagingVO} pagingVO
 * @returns {Promise<ListAndCountDTO<BrandDTO>>}
 */
module.exports.search = ({ pagingSize, pagingIndex, order }) => {
    return Brand.findAndCountAll({
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        order,
        raw: true,
        nest: true,
    }).then((it) => {
        it.rows = it.rows.map((it) => new BrandDTO(it));
        return new ListAndCountDTO(it);
    });
};

/**
 * 브랜드 전체 목록 조회
 *
 * @returns {Promise<ListAndCountDTO<BrandDTO>>}
 */
module.exports.readAll = async () => {
    return Brand.findAndCountAll({
        raw: true,
        nest: true,
    }).then((result) => {
        return new ListAndCountDTO({
            count: result.count,
            rows: result.rows.map((it) => new BrandDTO(it)),
        });
    });
};

/**
 * 브랜드 검색
 *
 * @param {Object} condition
 * @returns {Promise<Brand>}
 */
module.exports.findBrand = (condition) => {
    return Brand.findOne({
        where: { ...condition },
        nest: true,
        raw: true,
    }).then((it) => {
        if (!it) {
            throw new NotMatchedError();
        }
        return new BrandDTO(it);
    });
};
