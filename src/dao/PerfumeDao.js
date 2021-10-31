const _ = require('lodash');
const {
    NotMatchedError,
    DuplicatedEntryError,
} = require('../utils/errors/errors.js');

const {
    Perfume,
    PerfumeSurvey,
    Brand,
    LikePerfume,
    SearchHistory,
    sequelize,
    Sequelize,
} = require('../models');
const { Op } = Sequelize;

const { ranking } = require('../mongoose_models');

const PERFUME_THUMB_COLUMNS = [
    'perfumeIdx',
    'name',
    'englishName',
    'imageUrl',
    'brandIdx',
    'createdAt',
    'updatedAt',
];

const SQL_RECOMMEND_PERFUME_BY_AGE_AND_GENDER_SELECT =
    'SELECT ' +
    'COUNT(*) AS "SearchHistory.weight", ' +
    'p.perfume_idx AS perfumeIdx, p.brand_idx AS brandIdx, p.name, p.english_name AS englishName, p.image_url AS imageUrl, p.created_at AS createdAt, p.updated_at AS updatedAt, ' +
    'b.brand_idx AS "Brand.brandIdx", ' +
    'b.name AS "Brand.name", ' +
    'b.english_name AS "Brand.englishName", ' +
    'b.first_initial AS "Brand.firstInitial", ' +
    'b.image_url AS "Brand.imageUrl", ' +
    'b.description AS "Brand.description" ' +
    'FROM search_histories sh ' +
    'INNER JOIN perfumes p ON sh.perfume_idx = p.perfume_idx ' +
    'INNER JOIN brands b ON p.brand_idx = b.brand_idx ' +
    'INNER JOIN users u ON sh.user_idx = u.user_idx ' +
    'WHERE u.gender = $1 AND (u.birth BETWEEN $2 AND $3) ' +
    'GROUP BY sh.perfume_idx ' +
    'ORDER BY "SearchHistory.weight" DESC ';

const SQL_SEARCH_PERFUME_SELECT =
    'SELECT ' +
    'p.perfume_idx AS perfumeIdx, p.brand_idx AS brandIdx, p.name, p.english_name AS englishName, p.image_url AS imageUrl, p.created_at AS createdAt, p.updated_at AS updatedAt, ' +
    'b.brand_idx AS "Brand.brandIdx", ' +
    'b.name AS "Brand.name", ' +
    'b.english_name AS "Brand.englishName", ' +
    'b.first_initial AS "Brand.firstInitial", ' +
    'b.image_url AS "Brand.imageUrl", ' +
    'b.description AS "Brand.description", ' +
    'IFNULL((SELECT COUNT(jpk.keyword_idx) FROM join_perfume_keywords jpk WHERE jpk.perfume_idx = p.perfume_idx AND jpk.keyword_idx IN (:keywords) GROUP BY jpk.perfume_idx), 0) AS "Score.keyword", ' +
    'IFNULL((SELECT COUNT(n.ingredient_idx) FROM notes n WHERE n.perfume_idx = p.perfume_idx AND n.ingredient_idx IN (:ingredients) GROUP BY n.perfume_idx), 0) AS "Score.ingredient", ' +
    '(IFNULL((SELECT COUNT(jpk.keyword_idx) FROM join_perfume_keywords jpk WHERE jpk.perfume_idx = p.perfume_idx AND jpk.keyword_idx IN (:keywords) GROUP BY jpk.perfume_idx), 0) + IFNULL((SELECT COUNT(n.ingredient_idx) FROM notes n WHERE n.perfume_idx = p.perfume_idx AND n.ingredient_idx IN (:ingredients) GROUP BY n.perfume_idx), 0)) AS "Score.total" ' +
    'FROM perfumes p ' +
    'INNER JOIN brands b ON p.brand_idx = b.brand_idx ' +
    ':whereCondition ' +
    'ORDER BY :orderCondition ' +
    'LIMIT :limit ' +
    'OFFSET :offset';
const SQL_ORDER_DEFAULT =
    '(IFNULL((SELECT COUNT(jpk.keyword_idx) FROM join_perfume_keywords jpk WHERE jpk.perfume_idx = p.perfume_idx AND jpk.keyword_idx IN (:keywords) GROUP BY jpk.perfume_idx), 0) + IFNULL((SELECT COUNT(n.ingredient_idx) FROM notes n WHERE n.perfume_idx = p.perfume_idx AND n.ingredient_idx IN (:ingredients) GROUP BY n.perfume_idx), 0)) DESC';
const SQL_SEARCH_BRAND_CONDITION = ' p.brand_idx IN (:brands)';
const SQL_SEARCH_KEYWORD_CONDITION =
    'IFNULL((SELECT COUNT(jpk.keyword_idx) FROM join_perfume_keywords jpk WHERE jpk.perfume_idx = p.perfume_idx AND jpk.keyword_idx IN (:keywords) GROUP BY jpk.perfume_idx), 0) > 0 ';
const SQL_SEARCH_INGREDIENT_CONDITION =
    'IFNULL((SELECT COUNT(n.ingredient_idx) FROM notes n WHERE n.perfume_idx = p.perfume_idx AND n.ingredient_idx IN (:ingredients) GROUP BY n.perfume_idx), 0) > 0 ';

const SQL_SEARCH_PERFUME_SELECT_COUNT =
    'SELECT ' +
    'COUNT(p.perfume_idx) as count ' +
    'FROM perfumes p ' +
    'INNER JOIN brands b ON p.brand_idx = b.brand_idx ' +
    ':whereCondition ';

const defaultOption = {
    include: [
        {
            model: Brand,
            as: 'Brand',
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            required: true,
        },
    ],
    raw: true,
    nest: true,
};

function compactVolumeAndPrice(volumeAndPrice) {
    return Object.entries(volumeAndPrice)
        .map(([key, value]) => {
            return `${key}/${value}`;
        })
        .join(',');
}

/**
 * 향수 검색
 *
 * @param {number[]} brandIdxList
 * @param {number[]} ingredientIdxList
 * @param {number[]} keywordIdxList
 * @param {string} searchText
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @param {array} sort - 정렬 조건
 * @returns {Promise<Perfume[]>} perfumeList
 */
module.exports.search = async (
    brandIdxList,
    ingredientIdxList,
    keywordIdxList,
    searchText,
    pagingIndex,
    pagingSize,
    order = []
) => {
    let orderCondition = '';
    if (!order || order.length == 0) {
        orderCondition = SQL_ORDER_DEFAULT;
    } else {
        orderCondition = order
            .map((it) => {
                if (it.fn) {
                    return `${it.fn}(${it.args})`;
                }
                return `${it[0]} ${it[1]}`;
            })
            .join(' ');
    }

    let whereCondition = '';
    if (
        ingredientIdxList.length + keywordIdxList.length + brandIdxList.length >
        0
    ) {
        const arr = [ingredientIdxList, keywordIdxList, brandIdxList];
        const conditionSQL = [
            SQL_SEARCH_INGREDIENT_CONDITION,
            SQL_SEARCH_KEYWORD_CONDITION,
            SQL_SEARCH_BRAND_CONDITION,
        ];
        whereCondition =
            'WHERE ' +
            arr
                .reduce((prev, cur, index) => {
                    if (cur.length > 0) {
                        prev.push(conditionSQL[index]);
                    }
                    return prev;
                }, [])
                .join(' AND ');
    }
    if (searchText && searchText.length > 0) {
        whereCondition = `${whereCondition} AND ( p.name LIKE '%${searchText}%'`;
        if (brandIdxList.length == 0) {
            whereCondition = `${whereCondition} OR b.name LIKE '%${searchText}%'`;
        }
        whereCondition = `${whereCondition} )`;
    }
    const countSQL = SQL_SEARCH_PERFUME_SELECT_COUNT.replace(
        ':whereCondition',
        whereCondition
    );
    const selectSQL = SQL_SEARCH_PERFUME_SELECT.replace(
        ':whereCondition',
        whereCondition
    ).replace(':orderCondition', orderCondition);

    if (ingredientIdxList.length == 0) ingredientIdxList.push(-1);
    if (brandIdxList.length == 0) brandIdxList.push(-1);
    if (keywordIdxList.length == 0) keywordIdxList.push(-1);
    const [{ count }] = await sequelize.query(countSQL, {
        replacements: {
            keywords: keywordIdxList,
            brands: brandIdxList,
            ingredients: ingredientIdxList,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
    });
    const rows = await sequelize.query(selectSQL, {
        replacements: {
            keywords: keywordIdxList,
            brands: brandIdxList,
            ingredients: ingredientIdxList,
            limit: pagingSize,
            offset: (pagingIndex - 1) * pagingSize,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
        nest: true,
    });
    return {
        count,
        rows,
    };
};

/**
 * 새로 등록된 향수 조회
 *
 * @param {Date} fromDate
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise<Perfume[]>} perfumeList
 */
module.exports.readNewPerfume = async (fromDate, pagingIndex, pagingSize) => {
    const options = Object.assign({}, defaultOption, {
        where: {
            createdAt: {
                [Op.gte]: fromDate,
            },
        },
        attributes: PERFUME_THUMB_COLUMNS,
        include: [
            {
                model: Brand,
                as: 'Brand',
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            },
        ],
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        order: [['createdAt', 'desc']],
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
    perfume.volumeAndPrice = perfume.volumeAndPrice
        .split(',')
        .filter((str) => str.length > 0)
        .map((str) => {
            const [volume, price] = str.split('/');
            return { volume: parseInt(volume), price: parseInt(price) };
        });
    return perfume;
};

/**
 * 위시 리스트에 속하는 향수 조회
 *
 * @param {number} userIdx
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise<Perfume[]>} perfumeList
 */
module.exports.readLikedPerfume = async (userIdx, pagingIndex, pagingSize) => {
    const options = _.merge({}, defaultOption, {
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        attributes: PERFUME_THUMB_COLUMNS,
    });
    options.include.push({
        model: LikePerfume,
        as: 'LikePerfume',
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        where: {
            userIdx,
        },
        required: true,
    });
    return Perfume.findAndCountAll(options);
};

/**
 * 최근에 검색한 향수 조회
 *
 * @param {number} userIdx
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise<Perfume[]>}
 */
module.exports.recentSearchPerfumeList = async (
    userIdx,
    pagingIndex,
    pagingSize
) => {
    const options = _.merge({}, defaultOption, {
        order: [
            [
                { model: SearchHistory, as: 'SearchHistory' },
                'updatedAt',
                'desc',
            ],
        ],
        attributes: PERFUME_THUMB_COLUMNS,
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
    });
    options.include.push({
        model: SearchHistory,
        as: 'SearchHistory',
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        where: {
            userIdx,
        },
        required: true,
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
            bind: [gender, startYear, endYear],
            type: sequelize.QueryTypes.SELECT,
            offset: (pagingIndex - 1) * pagingSize,
            limit: pagingSize,
            attributes: PERFUME_THUMB_COLUMNS,
            raw: true,
            nest: true,
        }
    );
    perfumeList.forEach((it) => {
        delete it.SearchHistory;
    });
    const result = {
        count: perfumeList.length,
        rows: perfumeList,
    };
    ranking.upsert(
        // mongo DB 응답이 없는 경우 무한 대기하는 현상 방지를 위해 await 제거
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
        require: true,
    });
    const perfumeList = await Perfume.findAndCountAll(options);
    return perfumeList;
};

/**
 * 향수 전체 조회
 *
 * @returns {Promise<Perfume[]>}
 */
module.exports.readAll = () => {
    return Perfume.findAll();
};
