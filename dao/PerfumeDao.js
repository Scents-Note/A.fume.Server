const _ = require('lodash');
const { NotMatchedError } = require('../utils/errors/errors.js');

const {
    Perfume,
    PerfumeDetail,
    PerfumeSurvey,
    Brand,
    Series,
    LikePerfume,
    SearchHistory,
    User,
    sequelize,
    Sequelize,
} = require('../models');
const { Op } = Sequelize;

const { ranking } = require('../mongoose_models');

const SQL_RECOMMEND_PERFUME_BY_AGE_AND_GENDER_SELECT =
    'SELECT ' +
    'COUNT(*) as "SearchHistory.weight", ' +
    'p.perfume_idx as perfumeIdx, p.main_series_idx as mainSeriesIdx, p.brand_idx as brandIdx, p.name, p.english_name as englishName, p.image_thumbnail_url as imageUrl, p.release_date as releaseDate, p.like_cnt as likeCnt, ' +
    'b.brand_idx as "Brand.brandIdx", ' +
    'b.name as "Brand.name", ' +
    'b.english_name as "Brand.englishName", ' +
    'b.first_initial as "Brand.firstInitial", ' +
    'b.image_url as "Brand.imageUrl", ' +
    'b.description as "Brand.description", ' +
    's.series_idx as "MainSeries.seriesIdx", ' +
    's.name as "MainSeries.name", ' +
    's.english_name as "MainSeries.englishName", ' +
    's.description as "MainSeries.description" ' +
    'FROM search_histories sh ' +
    'INNER JOIN perfumes p ON sh.perfume_idx = p.perfume_idx ' +
    'INNER JOIN brands b ON p.brand_idx = b.brand_idx ' +
    'INNER JOIN series s ON p.main_series_idx = s.series_idx ' +
    'INNER JOIN users u ON sh.user_idx = u.user_idx ' +
    'WHERE u.gender = $1 AND (u.birth BETWEEN $2 AND $3) ' +
    'GROUP BY sh.perfume_idx ' +
    'ORDER BY "SearchHistory.weight" DESC ' +
    'LIMIT $4 ' +
    'OFFSET $5';

const defaultOption = {
    include: [
        {
            model: Brand,
            as: 'Brand',
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        },
        {
            model: Series,
            as: 'MainSeries',
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        },
        {
            model: PerfumeDetail,
            as: 'PerfumeDetail',
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        },
    ],
    raw: true,
    nest: true,
};

/**
 * 향수 추가
 *
 * @param {Object} perfume
 * @returns {Promise}
 */
module.exports.create = ({
    brandIdx,
    name,
    englishName,
    volumeAndPrice,
    imageThumbnailUrl,
    mainSeriesIdx,
    story,
    abundanceRate,
    imageUrl,
    releaseDate,
}) => {
    volumeAndPrice = JSON.stringify(volumeAndPrice);
    return sequelize.transaction(async (t) => {
        const { dataValues: perfumeResult } = await Perfume.create(
            {
                brandIdx,
                mainSeriesIdx,
                name,
                englishName,
                imageThumbnailUrl,
                releaseDate,
            },
            { transaction: t }
        );
        const perfumeIdx = perfumeResult.perfumeIdx;
        await PerfumeDetail.create(
            { perfumeIdx, story, abundanceRate, volumeAndPrice, imageUrl },
            { transaction: t }
        );
        return perfumeIdx;
    });
};

/**
 * 향수 검색
 *
 * @param {Object} Filter - series, brands, keywords
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @param {array} order - 정렬 조건
 * @returns {Promise<Perfume[]>} perfumeList
 */
module.exports.search = async (
    { series = [], brands = [], keywords = [] },
    pagingIndex,
    pagingSize,
    order = [['createdAt', 'asc']]
) => {
    order.forEach((it) => {
        it[0] = sequelize.literal(it[0]);
    });
    const options = Object.assign({}, defaultOption, {
        where: {
            //[Op.or]: keywords.map(it => { return {"brand.name": it }}),
        },
        include: [
            {
                model: Brand,
                as: 'Brand',
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                where: {
                    [Op.or]: brands.map((it) => {
                        return { name: it };
                    }),
                },
            },
            {
                model: Series,
                as: 'MainSeries',
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                where: {
                    [Op.or]: series.map((it) => {
                        return { name: it };
                    }),
                },
            },
            {
                model: PerfumeDetail,
                as: 'PerfumeDetail',
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            },
        ],
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        order,
    });
    options.include.forEach((it) => {
        if (!it.where || it.where[Op.or].length > 0) return;
        delete it.where;
    });
    return Perfume.findAndCountAll(options);
};

/**
 * 향수 세부 조회
 *
 * @param {number} perfumeIdx
 * @returns {Promise<Perfume>}
 */
module.exports.readByPerfumeIdx = async (perfumeIdx) => {
    const options = _.merge({}, defaultOption, {
        where: { perfumeIdx },
    });
    const perfume = await Perfume.findOne(options);
    if (!perfume) {
        throw new NotMatchedError();
    }
    perfume.PerfumeDetail.volumeAndPrice = Object.entries(
        JSON.parse(perfume.PerfumeDetail.volumeAndPrice)
    ).map(([volume, price]) => {
        return { volume: parseInt(volume), price: parseInt(price) };
    });
    return perfume;
};

/**
 * 위시 리스트에 속하는 향수 조회
 *
 * @param {number} userIdx
 * @returns {Promise<Perfume[]>} perfumeList
 */
module.exports.readAllOfWishlist = async (userIdx) => {
    const options = _.merge({}, defaultOption);
    options.include.push({
        model: LikePerfume,
        as: 'Wishlist',
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        where: {
            userIdx,
        },
    });
    const perfumeList = await Perfume.findAndCountAll(options);
    return perfumeList;
};

/**
 * 최근에 검색한 향수 조회
 *
 * @param {number} userIdx
 * @returns {Promise<Perfume[]>}
 */
module.exports.recentSearchPerfumeList = async (userIdx) => {
    const options = Object.assign({}, defaultOption, {
        limit: 10,
        order: [
            [{ model: SearchHistory, as: 'SearchHistory' }, 'createdAt', 'asc'],
        ],
    });
    options.include.push({
        model: SearchHistory,
        as: 'SearchHistory',
        include: {
            model: User,
            as: 'User',
            where: {
                userIdx,
            },
        },
    });
    return Perfume.findAndCountAll(options).then((result) => {
        result.rows.forEach((it) => {
            delete it.createTime;
        });
        return result;
    });
};

/**
 * 나이 및 성별에 기반한 향수 추천
 *
 * @param {string} gender
 * @param {number} ageGroup
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise<Perfume[]>}
 */
module.exports.recommendPerfumeByAgeAndGender = async (
    gender,
    ageGroup,
    pagingIndex,
    pagingSize
) => {
    const today = new Date();
    const startYear = today.getFullYear() - ageGroup - 8;
    const endYear = today.getFullYear() - ageGroup + 1;
    let perfumeList = await sequelize.query(
        SQL_RECOMMEND_PERFUME_BY_AGE_AND_GENDER_SELECT,
        {
            bind: [
                gender,
                startYear,
                endYear,
                pagingSize,
                (pagingIndex - 1) * pagingSize,
            ],
            type: sequelize.QueryTypes.SELECT,
            raw: true,
            nest: true,
        }
    );
    perfumeList.forEach((it) => {
        delete it.SearchHistory;
    });
    const result = {
        count: Math.min(pagingSize, perfumeList.length),
        rows: perfumeList,
    };
    await ranking.upsert(
        { gender, ageGroup },
        { title: '나이 및 성별에 따른 추천', result }
    );
    return result;
};
/**
 * 나이 및 성별에 기반한 향수 추천(MongoDB)
 *
 * @param {string} gender
 * @param {number} ageGroup
 * @returns {Promise<Perfume[]>}
 */
module.exports.recommendPerfumeByAgeAndGenderCached = (gender, ageGroup) => {
    return ranking.findItem({ gender, ageGroup });
};

/**
 * 서베이 추천 향수 조회
 *
 * @param {number} gender
 * @returns {Promise<Perfume[]>}
 */
module.exports.readPerfumeSurvey = async (gender) => {
    const options = _.merge({}, defaultOption);
    options.include.push({
        model: PerfumeSurvey,
        as: 'PerfumeSurvey',
        where: {
            gender,
        },
    });
    const perfumeList = await Perfume.findAndCountAll(options);
    return perfumeList;
};

/**
 * 향수 수정
 *
 * @param {Object} perfume - perfume & perfumeDetail을 합친 정보
 * @returns {Promise}
 */
module.exports.update = async ({
    perfumeIdx,
    name,
    mainSeriesIdx,
    brandIdx,
    englishName,
    volumeAndPrice,
    imageThumbnailUrl,
    story,
    abundanceRate,
    imageUrl,
    releaseDate,
}) => {
    const result = await sequelize.transaction(async (t) => {
        const [perfumeAffectedRows] = await Perfume.update(
            {
                brandIdx,
                mainSeriesIdx,
                name,
                englishName,
                imageThumbnailUrl,
                releaseDate,
            },
            { where: { perfumeIdx } }
        );
        if (perfumeAffectedRows == 0) {
            throw new NotMatchedError();
        }
        const detailAffectedRows = (
            await PerfumeDetail.update(
                { story, abundanceRate, volumeAndPrice, imageUrl, perfumeIdx },
                { where: { perfumeIdx } }
            )
        )[0];
        return [perfumeAffectedRows, detailAffectedRows];
    });
    return result;
};

/**
 * 향수 삭제
 *
 * @param {number} perfumeIdx
 * @return {Promise<number>}
 */
module.exports.delete = async (perfumeIdx) => {
    const result = await Promise.all([
        Perfume.destroy({ where: { perfumeIdx } }),
        PerfumeDetail.destroy({ where: { perfumeIdx } }),
    ]);
    return result[0];
};
