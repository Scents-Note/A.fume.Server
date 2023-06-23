import IngredientCategoryDao from '@dao/IngredientCategoryDao';

import { IngredientCategoryDTO, ListAndCountDTO } from '@dto/index';
import { Op } from 'sequelize';

class IngredientCategoryService {
    ingredientCategoryDao: IngredientCategoryDao;

    constructor(ingredientCategoryDao?: IngredientCategoryDao) {
        this.ingredientCategoryDao =
            ingredientCategoryDao ?? new IngredientCategoryDao();
    }

    async readPage(offset: number, limit: number, query: any) {
        const { target, keyword } = query;
        const whereOptions = {} as any;
        if (target && keyword) {
            switch (target) {
                case 'id':
                    whereOptions.id = keyword;
                    break;
                case 'name':
                    whereOptions.name = { [Op.startsWith]: keyword };
                    break;
            }
        }

        const { rows, count } = await this.ingredientCategoryDao.readPage(
            offset,
            limit,
            whereOptions
        );

        const perfumesWithCategory = rows.map((c) =>
            IngredientCategoryDTO.createByJson(c)
        );
        return new ListAndCountDTO(count, perfumesWithCategory);
    }
}

export default IngredientCategoryService;
