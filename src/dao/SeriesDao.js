import { NotMatchedError } from '../utils/errors/errors';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';
const { Series } = require('../models');

const { SeriesDTO } = require('../data/dto');

/**
 * 계열 조회
 *
 * @param {number} seriesIdx
 * @return {Promise<SeriesDTO>} seriesDTO
 */
module.exports.readByIdx = async (seriesIdx) => {
    const result = await Series.findByPk(seriesIdx);
    if (!result) {
        throw new NotMatchedError();
    }
    return new SeriesDTO(result.dataValues);
};

/**
 * 계열 조회
 *
 * @param {string} seriesName
 * @return {Promise<SeriesDTO>} seriesDTO
 */
module.exports.readByName = async (seriesName) => {
    const result = await Series.findOne({
        where: { name: seriesName },
        nest: true,
        raw: true,
    });
    if (!result) {
        throw new NotMatchedError();
    }
    return new SeriesDTO(result);
};

/**
 * 계열 전체 조회
 *
 * @param {PagingVO} pagingVO
 * @returns {Promise<ListAndCount<SeriesDTO>>} listAndCount
 */
module.exports.readAll = ({ pagingIndex, pagingSize, order }) => {
    return Series.findAndCountAll({
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        order,
        raw: true,
        nest: true,
    }).then((it) => {
        /* TODO */
        // return new ListAndCountDTO<SeriesDTO>(
        return new ListAndCountDTO(
            it.count,
            it.rows.map((it) => new SeriesDTO(it))
        );
    });
};

/**
 * 계열 검색
 *
 * @param {PagingVO} pagingVO
 * @returns {Promise<ListAndCountDTO<SeriesDTO>>} listAndCountDTO
 */
module.exports.search = ({ pagingIndex, pagingSize, order }) => {
    return Series.findAndCountAll({
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        order,
        raw: true,
        nest: true,
    }).then((it) => {
        /* TODO */
        // return new ListAndCountDTO<SeriesDTO>(
        return new ListAndCountDTO(
            it.count,
            it.rows.map((it) => new SeriesDTO(it))
        );
    });
};

/**
 * 계열 검색
 *
 * @param {Object} condition
 * @returns {Promise<SeriesDTO>} seriesDTO
 */
module.exports.findSeries = (condition) => {
    return Series.findOne({ where: condition, nest: true, raw: true }).then(
        (it) => {
            if (!it) {
                throw new NotMatchedError();
            }
            return new SeriesDTO(it);
        }
    );
};
