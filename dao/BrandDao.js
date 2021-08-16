const {
    NotMatchedError,
    DuplicatedEntryError,
} = require('../utils/errors/errors.js');

const { Brand } = require('../models');
const { BrandDTO, ListAndCountDTO, CreatedResultDTO } = require('../data/dto');
/**
 * 브랜드 생성
 *
 * @param {BrandDTO} brandDTO
 * @param {Promise}
 * @returns {Promise<CreatedResultDTO<BrandDTO>>} createdResultDTO
 */
module.exports.create = (brandDTO) => {
    return Brand.create({
        name: brandDTO.name,
        englishName: brandDTO.englishName,
        firstInitial: brandDTO.firstInitial,
        imageUrl: brandDTO.imageUrl,
        description: brandDTO.description,
    })
        .then((brand) => {
            return new CreatedResultDTO({
                idx: brand.brandIdx,
                created: new BrandDTO(brand),
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
 * 브랜드 수정
 *
 * @param {Object} Brand
 * @return {Promise<boolean>} isSuccess
 */
module.exports.update = ({
    brandIdx,
    name,
    englishName,
    firstInitial,
    imageUrl,
    description,
}) => {
    return Brand.update(
        {
            name,
            englishName,
            firstInitial,
            imageUrl,
            description,
        },
        { where: { brandIdx } }
    )
        .catch((err) => {
            if (
                err.parent.errno === 1062 ||
                err.parent.code === 'ER_DUP_ENTRY'
            ) {
                throw new DuplicatedEntryError();
            }
            throw err;
        })
        .then(([affectedRows]) => {
            if (affectedRows == 0) {
                throw new NotMatchedError();
            }
            return affectedRows;
        });
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
