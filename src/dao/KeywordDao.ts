import { logger } from '../modules/winston';
import { NotMatchedError } from '@errors';

const {
    Keyword,
    Sequelize,
    sequelize,
    JoinPerfumeKeyword,
    JoinReviewKeyword,
} = require('@sequelize');

const { Op } = Sequelize;

class KeywordDao {
    /**
     * 시향노트에 키워드 추가
     *
     * @param {Object}
     * @returns {Promise<any>}
     */
    create ({ 
        reviewIdx,
        keywordIdx, 
        perfumeIdx 
    } : {
        reviewIdx: number;
        keywordIdx: number;
        perfumeIdx: number;
    }) : Promise<any> {
        return sequelize.transaction(async (t: any) => {
            try {
                const createReviewKeyword = await JoinReviewKeyword.create(
                    {
                        reviewIdx,
                        keywordIdx,
                    },
                    { transaction: t }
                );

                const createPerfumeKeyword = await JoinPerfumeKeyword.findOrCreate({
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
            }
        });
    };

    /**
     * 시향노트에 키워드 삭제
     *
     * @param {Object}
     * @returns {Promise<any>}
     */
    async deleteReviewKeyword ({ 
        reviewIdx, 
        perfumeIdx
    } : {
        reviewIdx: number,
        perfumeIdx: number
    }) : Promise<any> {
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
    };

    /**
     * 키워드 전체 목록 조회
     *
     * @returns {any[]} KeywordListDTO
     */
    readAll(pagingIndex: number = 1, pagingSize: number = 10) : any[] { 
        //LIMIT는 가져올 게시물의 수, OFFSET은 어디서부터 가져올거냐(몇 페이지를 가져오고 싶냐)
        return Keyword.findAndCountAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
            offset: (pagingIndex - 1) * pagingSize,
            limit: pagingSize,
            raw: true,
            nest: true,
        });
    };

    /**
     * 향수별 키워드 목록 조회
     *
     * @param {number} [perfumeIdx = -1]
     * @param {string[][]} sort
     * @param {Object} condition
     * @param {number} limitSize
     * @returns {Promise<any>} keywordListObject
     */
     async readAllOfPerfume (
        perfumeIdx: number,
        sort: string[][] = [['count', 'desc']],
        condition: Object = { [Op.gte]: 3 },
        limitSize : number = 9
    ) : Promise<any> {
        const result : any[] = await JoinPerfumeKeyword.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: {
                model: Keyword,
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            },
            order: sort,
            where: { perfumeIdx, count: condition },
            limit: limitSize,
            raw: true, //Set this to true if you don't have a model definition for your query.
            nest: true,
        });

        if (result.length === 0 ) {
            throw new NotMatchedError();
        }

        return result.map((it) => {
            return it.Keyword;
        });
    };

    /**
     * 향수가 가진 키워드별 개수 조회
     * 
     * @param {number} perfumeIdx
     * @param {string[][]} sort
     * @returns {Promise<any>} keywordList
     */
     async readAllPerfumeKeywordCount (
        perfumeIdx: number,
        sort : string[][] = [['count', 'desc']]
    ) : Promise<any> {
        let result = await JoinPerfumeKeyword.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'perfumeIdx'],
            },
            order: sort,
            where: { perfumeIdx },
            raw: true, //Set this to true if you don't have a model definition for your query.
            nest: true,
        });

        if (result === undefined) {
            throw new NotMatchedError();
        }
        return result;
    };

    /**
     * 향수별 특정 키워드 매칭 정보 조회
     * 
     * @param {Object}
     * @returns {Promise<number>} count
     */
    async readPerfumeKeywordCount ({ 
        perfumeIdx, 
        keywordIdx 
    } : {
        perfumeIdx: number;
        keywordIdx: number;
    }) : Promise<number> {
        let result = await JoinPerfumeKeyword.findOne({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            where: {
                perfumeIdx,
                keywordIdx,
            },
            raw: true, // To receive a plain response instead, pass { raw: true } as an option to the finder method.
            nest: true,
        });

        if (result === null) {
            throw new NotMatchedError();
        }
        return result.count;
    };

    /**
     * 특정 향수가 가진 키워드 목록 조회
     *
     * @param {number[]} perfumeIdxList
     * @param {string[][]} sort
     * @param {Object} condition
     * @param {number} limitSize
     * @returns {Promise<any>} keywordListDTO
     */
     async readAllOfPerfumeIdxList (
        perfumeIdxList : any,
        sort : string[][] = [['count', 'desc']],
        condition : Object = { [Op.gte]: 3 },
        limitSize : number = 2
    ) : Promise<any> {
        let result = await JoinPerfumeKeyword.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: {
                model: Keyword,
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            },
            order: sort,
            where: {
                perfumeIdx: {
                    [Op.in]: perfumeIdxList,
                },
                count: condition,
            },
            limit: limitSize,
            raw: true, // To receive a plain response instead, pass { raw: true } as an option to the finder method.
            nest: true,
        });

        if (result.length === 0) {
            throw new NotMatchedError();
        }

        return result;
    };

    /**
     * 특정 시향노트가 가진 키워드 목록 조회
     *
     * @param {number} reviewIdx
     * @returns {any[]} keywordListDTO
     */
    readAllOfReview (reviewIdx: number) : any[] {
        return JoinReviewKeyword.findAll({
            where: { reviewIdx },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: [
                {
                    model: Keyword,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            ],
            raw: true,
            nest: true,
        });
    };

    /**
     * 키워드명으로 키워드 인덱스 조회 
     *
     * @param {string} keywordName
     * @returns {number} keyword index
     */
    async readKeywordIdx (keywordName: string) : Promise<any> {
        const keyword = await Keyword.findOne({
            where: { name: keywordName },
            raw: true,
            nest: true,
        });
        return keyword.id;
    };

    /**
     * 키워드 인덱스로 키워드명 조회 
     *
     * @param {number} keywordIdx
     * @returns {strint} keyword name
     */
    async readKeywordName (keywordIdx: number) : Promise<any> {
        const keyword = await Keyword.findByPk({
            where: { keywordIdx },
            raw: true,
            nest: true,
        });
        return keyword.name;
    };
}

export default KeywordDao;
