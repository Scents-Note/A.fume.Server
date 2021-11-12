'use strict';
import IngredientDao from '../dao/IngredientDao';
import ingredientConditionDTO from '../data/dto/IngredientConditionDTO';

class IngredientService {
    ingredientDao: IngredientDao;

    constructor(ingredientDao?: IngredientDao) {
        this.ingredientDao = ingredientDao ?? new IngredientDao();
    }

    /**
     * 향료 목록 조회
     *
     * @returns {Promise<ListAndCountDTO<IngredientDTO>>} ListAndCountDTO<IngredientDTO>
     **/
    getIngredientAll() {
        return this.ingredientDao.readAll({});
    }

    /**
     * 재료 검색
     *
     * @param {IngredientConditionDTO} ingredientConditionDTO
     * @returns {Promise<IngredientDTO>} ingredientDTO
     **/
    findIngredient(ingredientConditionDTO: ingredientConditionDTO) {
        return this.ingredientDao.findIngredient(ingredientConditionDTO);
    }

    /**
     * 계열에 해당하는 재료 조회
     *
     * @param {number} seriesIdx
     * @returns {Promise<ListAndCountDTO<IngredientDTO>>} ListAndCountDTO<IngredientDTO>
     */
    getIngredientList(seriesIdx: number) {
        return this.ingredientDao.readAll({ seriesIdx });
    }

    setIngredientDao(dao: IngredientDao) {
        this.ingredientDao = dao;
    }
}

export default IngredientService;
