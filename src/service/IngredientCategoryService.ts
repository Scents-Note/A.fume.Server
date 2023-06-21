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
                    whereOptions.ingredientIdx = keyword;
                    break;
                case 'name':
                    whereOptions.name = { [Op.startsWith]: keyword };
                    break;
                case 'englishName':
                    whereOptions.englishName = { [Op.startsWith]: keyword };
                    break;
            }
        }

        const perfumes = await this.ingredientCategoryDao.readPage(
            offset,
            limit,
            whereOptions
        );
        console.log(perfumes);
        const perfumesWithCategory = perfumes.map((perfume) =>
            IngredientCategoryDTO.createByJson(perfume)
        );
        console.log(perfumesWithCategory);
        return new ListAndCountDTO(
            perfumesWithCategory.length,
            perfumesWithCategory
        );
    }
}

export default IngredientCategoryService;
