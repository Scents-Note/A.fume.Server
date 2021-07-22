const {
    NotMatchedError,
    DuplicatedEntryError,
} = require('../utils/errors/errors.js');
const { Series } = require('../models');

const { SeriesDTO, ListAndCountDTO, CreatedResultDTO } = require('../data/dto');

/**
 * 계열 생성
 *
 * @param {SeriesInputDTO} seriesInputDTO
 * @return {number} insertIdx
 */
module.exports.create = ({ name, englishName, description, imageUrl }) => {
    return Series.create({
        name,
        englishName,
        description,
        imageUrl,
    })
        .then((series) => {
            return new CreatedResultDTO({
                idx: series.seriesIdx,
                created: new SeriesDTO(series),
            });
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
 * 계열 조회
 *
 * @param {number} seriesIdx
 * @return {Promise<SeriesDTO>}
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
 * @return {Promise<Series>}
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
 * @returns {Promise<Series[]>}
 */
module.exports.readAll = ({ pagingIndex, pagingSize, order }) => {
    return Series.findAndCountAll({
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        order,
        raw: true,
        nest: true,
    }).then((it) => {
        return new ListAndCountDTO({
            count: it.count,
            rows: it.rows.map((it) => new SeriesDTO(it)),
        });
    });
};

/**
 * 계열 검색
 *
 * @param {PagingVO} pagingVO
 * @returns {Promise<Series[]>}
 */
module.exports.search = ({ pagingIndex, pagingSize, order }) => {
    return Series.findAndCountAll({
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        order,
        raw: true,
        nest: true,
    }).then((it) => {
        return new ListAndCountDTO({
            count: it.count,
            rows: it.rows.map((it) => new SeriesDTO(it)),
        });
    });
};

/**
 * 계열 수정
 *
 * @param {SeriesInputDTO} seriesInputDTO
 * @return {Promise<number>} affectedRows
 */
module.exports.update = async ({
    seriesIdx,
    name,
    englishName,
    description,
}) => {
    const [affectedRows] = await Series.update(
        { name, englishName, description },
        { where: { seriesIdx } }
    );
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};

/**
 * 계열 삭제
 *
 * @param {number} seriesIdx
 * @returns {Promise<number>} affectedRow
 */
module.exports.delete = (seriesIdx) => {
    return Series.destroy({ where: { seriesIdx } });
};

/**
 * 계열 검색
 *
 * @param {Object} condition
 * @returns {Promise<Series>}
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
