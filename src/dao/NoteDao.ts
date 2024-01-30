import { logger } from '@modules/winston';

import { NoteDTO } from '@dto/index';

import { Note, Ingredient } from '@sequelize';

const LOG_TAG: string = '[Note/DAO]';

class NoteDao {
    /**
     * 향수에 해당하는 재료 조회
     *
     * @param {number} perfumeIdx
     * @return {Promise<NoteDTO[]>} NoteDTO[]
     */
    async readByPerfumeIdx(perfumeIdx: number): Promise<NoteDTO[]> {
        logger.debug(`${LOG_TAG} readByPerfumeIdx(perfumeIdx = ${perfumeIdx})`);
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
        }).then((it: Note[]) => {
            return it.map(
                (it: Note) =>
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
