const ListAndCountDTO = require('../data/dto/ListAndCountDTO');
const IngredientDTO = require('../data/dto/IngredientDTO');

module.exports.readByIdx = async (ingredientIdx) => {
    return IngredientDTO.createWithIdx({ ingredientIdx, seriesIdx: 1 });
};

module.exports.readByName = async (ingredientName) => {
    return IngredientDTO.create({ ingredientName });
};

module.exports.readAll = async (where = {}) => {
    const seriesIdx = where.seriesIdx || 1;
    return new ListAndCountDTO({
        count: 5,
        rows: [1, 2, 3, 4, 5].map((idx) =>
            IngredientDTO.createWithIdx({ ingredientIdx: idx, seriesIdx })
        ),
    });
};

module.exports.search = async (pagingIndex, pagingSize, order) => {
    return new ListAndCountDTO({
        count: 5,
        rows: [1, 2, 3, 4, 5].map((idx) =>
            IngredientDTO.createWithIdx({ ingredientIdx: idx, seriesIdx: idx })
        ),
    });
};

module.exports.readBySeriesIdxList = async (seriesIdxList) => {
    return [1, 2, 3, 4, 5].map((idx) =>
        IngredientDTO.createWithIdx({ ingredientIdx: idx, seriesIdx: idx })
    );
};

module.exports.findIngredient = async (condition) => {
    return IngredientDTO.create(condition);
};
