import { logger } from '../modules/winston';
import { NotMatchedError } from '@errors';

import {
    Keyword,
    sequelize,
    JoinPerfumeKeyword,
    JoinReviewKeyword,
} from '@sequelize';
import { Op, Order, Transaction } from 'sequelize';

class KeywordDao {
    /**
     * 시향노트에 키워드 추가
     *
     * @param {Object}
     * @returns {Promise<any>}
     */
    create({
        reviewIdx,
        keywordIdx,
        perfumeIdx,
    }: {
        reviewIdx: number;
        keywordIdx: number;
        perfumeIdx: number;
    }): Promise<any> {
        return sequelize.transaction(async (t: Transaction) => {
            try {
                const createReviewKeyword = await JoinReviewKeyword.create(
                    {
                        reviewIdx,
                        keywordIdx,
                    },
                    { transaction: t }
                );

                const createPerfumeKeyword =
                    await JoinPerfumeKeyword.findOrCreate({
                        where: { perfumeIdx, keywordIdx },
                        transaction: t,
                    });

                const updatePerfumeKeyword = await JoinPerfumeKeyword.update(
                    { count: sequelize.literal('count + 1') },
                    {
                        where: { perfumeIdx, keywordIdx },
                        transaction: t,
                    }
                );
                return [
                    createReviewKeyword,
                    createPerfumeKeyword,
                    updatePerfumeKeyword,
                ];
            } catch (err) {
                logger.error(err);
                throw err;
            }
        });
    }

    /**
     * 시향노트에 키워드 삭제
     *
     * @param {Object}
     * @returns {Promise<any>}
     */
    async deleteReviewKeyword({
        reviewIdx,
        perfumeIdx,
    }: {
        reviewIdx: number;
        perfumeIdx: number;
    }): Promise<any> {
        return sequelize.transaction(async (t: any): Promise<void> => {
            const keywordList = await JoinReviewKeyword.findAll({
                where: { reviewIdx },
                attributes: {
                    exclude: ['reviewIdx', 'createdAt', 'updatedAt'],
                },
                transaction: t,
            });

            await JoinReviewKeyword.destroy({
                where: { reviewIdx },
                transaction: t,
            });

            await Promise.all(
                keywordList.map((it: any) => {
                    return JoinPerfumeKeyword.update(
                        { count: sequelize.literal('count - 1') },
                        {
                            where: { perfumeIdx, keywordIdx: it.keywordIdx },
                            transaction: t,
                        }
                    );
                })
            );

            await JoinPerfumeKeyword.destroy({
                where: {
                    count: {
                        [Op.lte]: 0,
                    },
                },
                transaction: t,
            });
        });
    }

    /**
     * 키워드 전체 목록 조회
     * @param {number} pagingIndex
     * @param {number} pagingSize
     * @param {string[][]} sort
     * @returns {any[]} KeywordListDTO
     */
    readAll(
        pagingIndex: number = 1,
        pagingSize: number = 10,
        sort: Order = [['name', 'asc']]
    ): Promise<{ rows: Keyword[]; count: number }> {
        //LIMIT는 가져올 게시물의 수, OFFSET은 어디서부터 가져올거냐(몇 페이지를 가져오고 싶냐)
        return Keyword.findAndCountAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
            order: sort,
            offset: (pagingIndex - 1) * pagingSize,
            limit: pagingSize,
            raw: true,
            nest: true,
        });
    }

    /**
     * 향수별 키워드 목록 조회
     *
     * @param {number} [perfumeIdx = -1]
     * @param {string[][]} sort
     * @param {Object} condition
     * @param {number} limitSize
     * @returns {Promise<any>} keywordListObject
     */
    async readAllOfPerfume(
        perfumeIdx: number,
        sort: Order = [['count', 'desc']],
        condition: any = {},
        limitSize: number = 9
    ): Promise<any> {
        const result: any[] = await JoinPerfumeKeyword.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: {
                model: Keyword,
                as: 'Keyword',
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            },
            order: sort,
            where: Object.assign(
                {
                    perfumeIdx,
                },
                condition
            ),
            limit: limitSize,
            raw: true, //Set this to true if you don't have a model definition for your query.
            nest: true,
        });

        if (result.length === 0) {
            throw new NotMatchedError();
        }

        return result.map((it) => {
            return it.Keyword;
        });
    }

    /**
     * 특정 향수가 가진 키워드 목록 조회
     *
     * @param {number[]} perfumeIdxList
     * @param {string[][]} sort
     * @param {Object} condition
     * @param {number} limitSize
     * @returns {Promise<any>} keywordListDTO
     */
    async readAllOfPerfumeIdxList(
        perfumeIdxList: any,
        sort: Order = [['count', 'desc']],
        condition: any = {},
        limitSize: number = 2
    ): Promise<any> {
        const result = await JoinPerfumeKeyword.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: {
                model: Keyword,
                as: 'Keyword',
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            },
            order: sort,
            where: Object.assign(
                {
                    perfumeIdx: {
                        [Op.in]: perfumeIdxList,
                    },
                },
                condition
            ),
            limit: limitSize,
            raw: true, // To receive a plain response instead, pass { raw: true } as an option to the finder method.
            nest: true,
        });

        if (result.length === 0) {
            throw new NotMatchedError();
        }

        return result;
    }

    /**
     * 키워드명으로 키워드 인덱스 조회
     *
     * @param {string} keywordName
     * @returns {number} keyword index
     */
    async readKeywordIdx(keywordName: string): Promise<any> {
        const keyword = await Keyword.findOne({
            where: { name: keywordName },
            raw: true,
            nest: true,
        });
        return keyword?.id;
    }
}

export default KeywordDao;
