import { NotMatchedError, DuplicatedEntryError } from '@errors';

import {
    sequelize,
    Review,
    Perfume,
    Brand,
    JoinReviewKeyword,
    Keyword,
} from '@sequelize';
import { Op, Order, QueryTypes } from 'sequelize';

const ACCESS_PUBLIC: number = 1;
const ACCESS_PRIVATE: number = 0;

const SQL_READ_ALL_OF_PERFUME = `
    SELECT 
    r.id as reviewIdx, 
    r.score as score, 
    r.longevity as longevity, 
    r.sillage as sillage, 
    r.seasonal as seasonal, 
    r.gender as gender, 
    r.access as access, 
    r.content as content, 
    r.created_at as createdAt,
    u.user_idx as "User.userIdx", 
    u.email as "User.email",
    u.nickname as "User.nickname", 
    u.password as "User.password", 
    u.gender as "User.gender",  
    u.birth as "User.birth", 
    u.grade as "User.grade", 
    u.access_time as "User.accessTime",
    IF( likeCount IS NULL, 0, likeCount) as "LikeReview.likeCount"
    FROM reviews r
    join users u on u.user_idx = r.user_idx 
    left outer join (SELECT review_idx, COUNT(review_idx) as likeCount FROM like_reviews Group By review_idx) AS lr on r.id = lr.review_idx    
    where r.perfume_idx = $1 AND r.access >= $2 AND r.deleted_at IS NULL
    order by "LikeReview.likeCount" desc;
`;

class ReviewDao {
    /**
     * 시향노트 작성
     *
     * @param {Object}
     * @returns {Promise<any>}
     */

    create({
        perfumeIdx,
        userIdx,
        score,
        longevity,
        sillage,
        seasonal,
        gender,
        access,
        content,
    }: {
        perfumeIdx: number;
        userIdx: number;
        score: number;
        longevity: number;
        sillage: number;
        seasonal: number;
        gender: number;
        access: number;
        content: string;
    }): Promise<any> {
        try {
            return Review.create({
                perfumeIdx,
                userIdx,
                score,
                longevity,
                sillage,
                seasonal,
                gender,
                access,
                content,
            });
        } catch (err: Error | any) {
            if (err.parent.errno === 1062) {
                throw new DuplicatedEntryError();
            }
            throw err;
        }
    }

    /**
     * 시향노트 조회
     *
     * @param {number} reviewIdx
     * @returns {Promise<[]>} reviewDTO
     */

    // const SQL_REVIEW_SELECT_BY_IDX = `SELECT p.image_thumbnail_url as imageUrl, b.english_name as brandName, p.name, rv.score, rv.content, rv.longevity, rv.sillage, rv.seasonal, rv.gender, rv.access, rv.create_time as createTime, u.user_idx as userIdx, u.nickname FROM review rv NATURAL JOIN perfume p JOIN brand b ON p.brand_idx = b.brand_idx JOIN user u ON rv.user_idx = u.user_idx WHERE review_idx = ?`;
    async read(reviewIdx: number): Promise<any> {
        const readReviewResult = await Review.findByPk(reviewIdx, {
            include: [
                {
                    model: Perfume,
                    include: [
                        {
                            model: Brand,
                            as: 'Brand',
                        },
                    ],
                },
            ],
            raw: true,
            nest: true,
        });

        if (readReviewResult === null) {
            throw new NotMatchedError();
        }

        const readKeywordList = await JoinReviewKeyword.findAll({
            where: { reviewIdx },
            include: [
                {
                    model: Keyword,
                    as: 'Keyword',
                },
            ],
            raw: true,
            nest: true,
        });

        const keywordList = readKeywordList
            ? readKeywordList.map((it: any) => {
                  return {
                      keywordIdx: it.Keyword.id,
                      keyword: it.Keyword.name,
                  };
              })
            : [];

        return { ...readReviewResult, keywordList };
    }

    /**
     * 내가 쓴 시향노트 전체 조회
     *  = 마이퍼퓸 조회
     *  @TODO sort -> PagingDTO로 변경해야함
     *
     *  @param {number} userIdx
     *  @param {string[][]} sort
     *  @returns {Promise<[]>} reviewListDTO
     */

    readAllOfUser(
        userIdx: number,
        sort: Order = [['createdAt', 'desc']]
    ): Promise<any> {
        return Review.findAll({
            where: { userIdx },
            include: {
                model: Perfume,
                as: 'Perfume',
                include: [
                    {
                        model: Brand,
                        as: 'Brand',
                    },
                ],
            },
            order: sort,
            raw: true,
            nest: true,
        });
    }

    /**
     * 특정 상품의 시향노트 전체 조회(인기순 정렬)
     * 좋아요 개수가 0인 시향노트들은 맨 후반부에 출력됨.
     * 1차 정렬 기준은 좋아요 개수순, 만약 좋아요 개수가 같거나 없는 경우는 최신 순으로 해당부분만 2차 정렬됨.
     *
     * @param {number} perfumeIdx
     * @param {boolean} includePrivate
     * @returns {Promise<[]>} reviewListDTO
     */

    readAllOfPerfume(
        perfumeIdx: number,
        includePrivate: boolean = false
    ): Promise<Review[]> {
        return sequelize.query(SQL_READ_ALL_OF_PERFUME, {
            bind: [perfumeIdx, includePrivate ? ACCESS_PRIVATE : ACCESS_PUBLIC],
            nest: true,
            raw: true,
            model: Review,
            mapToModel: true,
            type: QueryTypes.SELECT,
        });
    }

    /**
     * 시향노트 수정
     *
     * @param {Object}
     * @returns {Promise<any>}
     */

    async update({
        score,
        longevity,
        sillage,
        seasonal,
        gender,
        access,
        content,
        reviewIdx,
    }: {
        score: number;
        longevity: number;
        sillage: number;
        seasonal: string[];
        gender: number;
        access: boolean;
        content: string;
        reviewIdx: number;
    }): Promise<any> {
        const result = await Review.update(
            { score, longevity, sillage, seasonal, gender, access, content },
            { where: { id: reviewIdx } }
        );

        if (result[0] == 0) {
            //update result[0]가 곧 affectedRow
            throw new NotMatchedError();
        }

        return result;
    }

    /**
     * 시향노트 삭제
     *
     * @param {number} reviewIdx
     * @return {Promise<any>}
     */

    delete(reviewIdx: number): Promise<any> {
        return Review.destroy({ where: { id: reviewIdx } });
    }

    /**
     * 특정 향수에 관해, 내가 작성한 시향노트 조회
     *
     * @param {Object}
     * @return {Promise<any>} ReviewDTO
     */
    findOne({
        userIdx,
        perfumeIdx,
    }: {
        userIdx: number;
        perfumeIdx: number;
    }): Promise<any> {
        return Review.findOne({
            where: {
                userIdx,
                perfumeIdx,
            },
            raw: true,
            nest: true,
        });
    }

    /**
     * 향수 리스트에 관해, 내가 작성한 시향노트 조회
     *
     * @param {number[]} userIdx
     * @param {number[]} perfumeIdxList
     * @returns {Promise}
     */
    readAllMineOfPerfumes(
        userIdx: number,
        perfumeIdxList: number[]
    ): Promise<any> {
        return Review.findAll({
            where: {
                userIdx,
                perfumeIdx: {
                    [Op.in]: perfumeIdxList,
                },
            },
            raw: true,
            nest: true,
        });
    }
}

export default ReviewDao;
