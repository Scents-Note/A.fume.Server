import { NotMatchedError, DuplicatedEntryError } from '../utils/errors/errors';
import BrandDTO from '../data/dto/BrandDTO';

const { Brand } = require('../models');
const { ListAndCountDTO } = require('../data/dto');

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
    return BrandDTO.createByJson(result);
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
        it.rows = it.rows.map((it) => BrandDTO.createByJson(it));
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
            rows: result.rows.map((it) => BrandDTO.createByJson(it)),
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
        return BrandDTO.createByJson(it);
    });
};
