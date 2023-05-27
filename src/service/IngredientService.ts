import { logger } from '@modules/winston';

import IngredientDao from '@dao/IngredientDao';

import { ListAndCountDTO, IngredientDTO, PagingDTO } from '@dto/index';

const LOG_TAG: string = '[Ingredient/Service]';

class IngredientService {
    ingredientDao: IngredientDao;

    constructor(ingredientDao?: IngredientDao) {
        this.ingredientDao = ingredientDao ?? new IngredientDao();
    }

    /**
     * 향료 목록 조회
     *
     * @returns {Promise<ListAndCountDTO<IngredientDTO>>} ListAndCountDTO<IngredientDTO>
     * @throws {NotMatchedError} if there is no Ingredient
     **/
    getIngredientAll(
        pagingDTO?: PagingDTO
    ): Promise<ListAndCountDTO<IngredientDTO>> {
        logger.debug(`${LOG_TAG} getIngredientAll()`);
        return this.ingredientDao.readAll({}, pagingDTO);
    }

    /**
     * 계열에 해당하는 재료 조회
     *
     * @param {number} seriesIdx
     * @returns {Promise<ListAndCountDTO<IngredientDTO>>} ListAndCountDTO<IngredientDTO>
     * @throws {NotMatchedError} if there is no Ingredient
     */
    getIngredientList(
        seriesIdx: number
    ): Promise<ListAndCountDTO<IngredientDTO>> {
        logger.debug(`${LOG_TAG} getIngredientList(seriesIdx = ${seriesIdx})`);
        return this.ingredientDao.readAll({ seriesIdx });
    }

    setIngredientDao(dao: IngredientDao) {
        this.ingredientDao = dao;
    }
}

export default IngredientService;
