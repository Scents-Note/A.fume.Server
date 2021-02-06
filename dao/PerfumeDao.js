const pool = require('../utils/db/pool.js');

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

const SQL_RECOMMEND_PERFUME_BY_AGE_AND_GENDER__SELECT =
    'SELECT ' +
    'COUNT(*) as "SearchHistory.weight", ' +
    'p.perfume_idx as perfumeIdx, p.main_series_idx as mainSeriesIdx, p.brand_idx as brandIdx, p.name, p.english_name as englishName, p.image_thumbnail_url as imageUrl, p.release_date as releaseDate, p.created_at as createdAt, p.updated_at as updatedAt,' +
    'b.brand_idx as "Brand.brandIdx", ' +
    'b.name as "Brand.name", ' +
    'b.english_name as "Brand.englishName", ' +
    'b.start_character as "Brand.startCharacter", ' +
    'b.image_url as "Brand.imageUrl", ' +
    'b.description as "Brand.description", ' +
    'b.created_at as "Brand.createdAt", ' +
    'b.updated_at as "Brand.updatedAt", ' +
    's.series_idx as "MainSeries.seriesIdx", ' +
    's.name as "MainSeries.name", ' +
    's.english_name as "MainSeries.englishName", ' +
    's.description as "MainSeries.description", ' +
    's.created_at as "MainSeries.createdAt", ' +
    's.updated_at as "MainSeries.updatedAt", ' +
    '(SELECT COUNT(*) FROM like_perfumes lp WHERE lp.perfume_idx = p.perfume_idx) as likeCnt, ' +
    '(SELECT COUNT(*) FROM like_perfumes lp WHERE lp.perfume_idx = p.perfume_idx AND lp.user_idx = $1) as isLiked ' +
    'FROM search_histories sh ' +
    'INNER JOIN perfumes p ON sh.perfume_idx = p.perfume_idx ' +
    'INNER JOIN brands b ON p.brand_idx = b.brand_idx ' +
    'INNER JOIN series s ON p.main_series_idx = s.series_idx ' +
    'INNER JOIN users u ON sh.user_idx = u.user_idx ' +
    'WHERE u.gender = $2 AND (u.birth BETWEEN $3 AND $4) ' +
    'GROUP BY sh.perfume_idx ' +
    'ORDER BY "SearchHistory.weight" DESC ' +
    'LIMIT 10 ';

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
 * @param {array} sort - 정렬 조건
 * @param {number} [userIdx=-1]
 * @returns {Promise<Perfume[]>} perfumeList
 */
module.exports.search = async (
    { series = [], brands = [], keywords = [] },
    sort = [['createdAt', 'asc']],
    userIdx = -1
) => {
    sort.forEach((it) => {
        it[0] = sequelize.literal(it[0]);
    });
    const options = {
        attributes: {
            include: [
                [
                    sequelize.literal(
                        `(SELECT COUNT(*) FROM like_perfumes lp WHERE lp.perfume_idx = perfumeIdx)`
                    ),
                    'likeCnt',
                ],
                [
                    sequelize.literal(
                        `(SELECT COUNT(*) FROM like_perfumes lp WHERE lp.perfume_idx = perfumeIdx AND lp.user_idx = ${userIdx})`
                    ),
                    'isLiked',
                ],
            ],
        },
        where: {
            //[Op.or]: keywords.map(it => { return {"brand.name": it }}),
        },
        include: [
            {
                model: Brand,
                as: 'Brand',
                where: {
                    [Op.or]: brands.map((it) => {
                        return { name: it };
                    }),
                },
            },
            {
                model: Series,
                as: 'MainSeries',
                where: {
                    [Op.or]: series.map((it) => {
                        return { name: it };
                    }),
                },
            },
            {
                model: PerfumeDetail,
                as: 'PerfumeDetail',
            },
        ],
        order: sort,
        raw: true,
        nest: true,
    };
    options.include.forEach((it) => {
        if (!it.where || it.where[Op.or].length > 0) return;
        delete it.where;
    });
    const perfumeList = await Perfume.findAll(options);
    perfumeList.map((it) => {
        it.isLiked = it.isLiked == 1;
        return it;
    });
    return perfumeList;
};

/**
 * 향수 세부 조회
 *
 * @param {number} perfumeIdx
 * @param {number} [userIdx=-1]
 * @returns {Promise<Perfume>}
 */
module.exports.readByPerfumeIdx = async (perfumeIdx, userIdx = -1) => {
    const perfume = await Perfume.findOne({
        attributes: {
            include: [
                [
                    sequelize.literal(
                        `(SELECT COUNT(*) FROM like_perfumes lp WHERE lp.perfume_idx = ${perfumeIdx})`
                    ),
                    'likeCnt',
                ],
                [
                    sequelize.literal(
                        `(SELECT COUNT(*) FROM like_perfumes lp WHERE lp.perfume_idx = ${perfumeIdx} AND lp.user_idx = ${userIdx})`
                    ),
                    'isLiked',
                ],
            ],
        },
        where: { perfumeIdx },
        include: [
            {
                model: Brand,
                as: 'Brand',
            },
            {
                model: Series,
                as: 'MainSeries',
            },
            {
                model: PerfumeDetail,
                as: 'PerfumeDetail',
            },
        ],
        raw: true,
        nest: true,
    });
    if (!perfume) {
        throw new NotMatchedError();
    }
    perfume.PerfumeDetail.volumeAndPrice = Object.entries(
        JSON.parse(perfume.PerfumeDetail.volumeAndPrice)
    ).map(([volume, price]) => {
        return { volume: parseInt(volume), price: parseInt(price) };
    });
    perfume.isLiked = perfume.isLiked === 1;
    return perfume;
};

/**
 * 위시 리스트에 속하는 향수 조회
 *
 * @param {number} [userIdx = -1]
 * @returns {Promise<Perfume[]>} perfumeList
 */
module.exports.readAllOfWishlist = async (userIdx) => {
    const options = {
        attributes: {
            include: [
                [
                    sequelize.literal(
                        `(SELECT COUNT(*) FROM like_perfumes lp WHERE lp.perfume_idx = perfumeIdx)`
                    ),
                    'likeCnt',
                ],
                [
                    sequelize.literal(
                        `(SELECT COUNT(*) FROM like_perfumes lp WHERE lp.perfume_idx = perfumeIdx AND lp.user_idx = ${userIdx})`
                    ),
                    'isLiked',
                ],
            ],
        },
        include: [
            {
                model: Brand,
                as: 'Brand',
            },
            {
                model: Series,
                as: 'MainSeries',
            },
            {
                model: PerfumeDetail,
                as: 'PerfumeDetail',
            },
            {
                model: LikePerfume,
                as: 'Wishlist',
                where: {
                    userIdx,
                },
            },
        ],
        raw: true,
        nest: true,
    };
    const perfumeList = await Perfume.findAll(options);
    perfumeList.map((it) => {
        it.isLiked = it.isLiked == 1;
        return it;
    });
    return perfumeList;
};

/**
 * 최근에 검색한 향수 조회
 *
 * @param {number} userIdx
 * @returns {Promise<Perfume[]>}
 */
module.exports.recentSearchPerfumeList = async (userIdx) => {
    const options = {
        attributes: {
            include: [
                [
                    sequelize.literal(
                        `(SELECT COUNT(*) FROM like_perfumes lp WHERE lp.perfume_idx = perfumeIdx)`
                    ),
                    'likeCnt',
                ],
                [
                    sequelize.literal(
                        `(SELECT COUNT(*) FROM like_perfumes lp WHERE lp.perfume_idx = perfumeIdx AND lp.user_idx = ${userIdx})`
                    ),
                    'isLiked',
                ],
            ],
        },
        include: [
            {
                model: Brand,
                as: 'Brand',
            },
            {
                model: Series,
                as: 'MainSeries',
            },
            {
                model: PerfumeDetail,
                as: 'PerfumeDetail',
            },
            {
                model: SearchHistory,
                as: 'SearchHistory',
                include: {
                    model: User,
                    as: 'User',
                    where: {
                        userIdx,
                    },
                },
            },
        ],
        limit: 10,
        raw: true,
        nest: true,
        order: [
            [{ model: SearchHistory, as: 'SearchHistory' }, 'createdAt', 'asc'],
        ],
    };
    const result = await Perfume.findAll(options);
    return result.map((it) => {
        delete it.createTime;
        return it;
    });
};

/**
 * 나이 및 성별에 기반한 향수 추천
 *
 * @param {string} gender
 * @param {number} startBirth
 * @param {number} endBirth
 * @returns {Promise<Perfume[]>}
 */
module.exports.recommendPerfumeByAgeAndGender = async (
    userIdx,
    gender,
    startBirth,
    endBirth
) => {
    const result = await sequelize.query(
        SQL_RECOMMEND_PERFUME_BY_AGE_AND_GENDER__SELECT,
        {
            bind: [userIdx, gender, startBirth, endBirth],
            type: sequelize.QueryTypes.SELECT,
        }
    );
    return result.map((it) => {
        delete it.createTime;
        delete it.weight;
        return it;
    });
};

/**
 * 서베이 추천 향수 조회
 *
 * @param {number} userIdx
 * @param {number} gender
 * @returns {Promise<Perfume[]>}
 */
module.exports.readPerfumeSurvey = async (userIdx, gender) => {
    const options = {
        attributes: {
            exclude: [
                'createdAt',
                'updatedAt',
                'mainSeriesIdx',
                'brandIdx',
                'release_date',
            ],
            include: [
                [
                    sequelize.literal(
                        `(SELECT COUNT(*) FROM like_perfumes lp WHERE lp.perfume_idx = perfumeIdx)`
                    ),
                    'likeCnt',
                ],
                [
                    sequelize.literal(
                        `(SELECT COUNT(*) FROM like_perfumes lp WHERE lp.perfume_idx = perfumeIdx AND lp.user_idx = ${userIdx})`
                    ),
                    'isLiked',
                ],
            ],
        },
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
            {
                model: PerfumeSurvey,
                as: 'PerfumeSurvey',
                where: {
                    gender,
                },
            },
        ],
        raw: true,
        nest: true,
    };
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
    return result[0] & result[1];
};
