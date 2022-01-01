import NoteDTO from '../data/dto/NoteDTO';

const { Note, Ingredient, sequelize, Sequelize } = require('../models');
const { Op } = Sequelize;

type IngredientCount = { ingredientIdx: number; count: number };

type IngredientEntry = {
    perfumeIdx: number;
    ingredientIdx: number;
    type: number;
    Ingredients: {
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
};

class NoteDao {
    /**
     * 노트 조회
     *
     * @param {Object} where
     * @returns {Promise<Note[]>}
     */
    read(where: any): Promise<NoteDTO[]> {
        return Note.findAll({
            where,
            nest: true,
            raw: true,
        }).then((it: any) => it.map(NoteDTO.createByJson));
    }

    /**
     * 재료별 사용된 향수 개수 카운트
     *
     * @param {number[]} ingredientIdxList
     */

    async countIngredientUsed(
        ingredientIdxList: number[]
    ): Promise<IngredientCount[]> {
        const result: IngredientCount[] = await Note.findAll({
            attributes: {
                include: [
                    [
                        sequelize.fn('count', sequelize.col('perfume_idx')),
                        'count',
                    ],
                ],
            },
            where: {
                ingredientIdx: {
                    [Op.in]: ingredientIdxList,
                },
            },
            group: ['ingredient_idx'],
            raw: true,
            nest: true,
        }).then((it: any[]) => {
            return it.map((it: any) => {
                return {
                    ingredientIdx: it.ingredientIdx,
                    count: it.count,
                };
            });
        });
        return result;
    }

    /**
     * 향수에 해당하는 재료 조회
     *
     * @param {number} perfumeIdx
     * @return {Promise<NoteDTO[]>} NoteDTO[]
     */
    async readByPerfumeIdx(perfumeIdx: number): Promise<NoteDTO[]> {
        const result: NoteDTO[] = await Note.findAll({
            include: [
                {
                    model: Ingredient,
                    as: 'Ingredients',
                    attributes: ['name'],
                },
            ],
            where: {
                perfumeIdx,
            },
            raw: true,
            nest: true,
        }).then((it: IngredientEntry[]) => {
            return it.map(
                (it: IngredientEntry) =>
                    new NoteDTO(
                        it.perfumeIdx,
                        it.ingredientIdx,
                        it.type,
                        it.Ingredients.name,
                        it.createdAt,
                        it.updatedAt
                    )
            );
        });
        return result;
    }
}

export default NoteDao;
