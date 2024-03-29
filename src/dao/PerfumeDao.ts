import _ from 'lodash';

import { logger } from '@modules/winston';

import { NotMatchedError } from '@errors';

import {
    ListAndCountDTO,
    PagingDTO,
    PerfumeDTO,
    PerfumeInquireHistoryDTO,
    PerfumeThumbDTO,
} from '@dto/index';

const LOG_TAG: string = '[Perfume/DAO]';

import {
    Brand,
    InquireHistory,
    LikePerfume,
    Perfume,
    PerfumeSurvey,
    sequelize,
} from '@sequelize';

import Sequelize, { QueryTypes, WhereOptions } from 'sequelize';

const PERFUME_THUMB_COLUMNS: string[] = [
    'perfumeIdx',
    'name',
    'englishName',
    'imageUrl',
    'brandIdx',
    'createdAt',
    'updatedAt',
];

import redis from '@utils/db/redis';

const SQL_SEARCH_RANDOM_PERFUME_WITH_MIN_REVIEW_COUNT: string =
    'SELECT ' +
    '`Perfume`.perfume_idx AS perfumeIdx, `Perfume`.brand_idx AS brandIdx, `Perfume`.name, `Perfume`.english_name AS englishName, `Perfume`.image_url AS imageUrl, `Perfume`.created_at AS createdAt, `Perfume`.updated_at AS updatedAt, ' +
    'COUNT(`Review`.`id`), ' +
    '`Brand`.`brand_idx` AS `Brand.brandIdx`, `Brand`.`name` AS `Brand.name`, `Brand`.`english_name` AS `Brand.englishName`, `Brand`.`first_initial` AS `Brand.firstInitial`, `Brand`.`image_url` AS `Brand.imageUrl`, `Brand`.`description` AS `Brand.description`, `Brand`.`created_at` AS `Brand.createdAt`, `Brand`.`updated_at` AS `Brand.updatedAt`, `Brand`.`deleted_at` AS `Brand.deletedAt` ' +
    'FROM `perfumes` AS `Perfume` ' +
    'INNER JOIN `brands` AS `Brand` ' +
    'ON `Perfume`.`brand_idx` = `Brand`.`brand_idx` ' +
    'INNER JOIN `reviews` As `Review` ' +
    'ON `Perfume`.`perfume_idx` = `Review`.`perfume_idx` ' +
    'WHERE (`Brand`.`deleted_at` IS NULL) AND (`Perfume`.`deleted_at` IS NULL) AND (`Review`.`deleted_at` IS NULL) AND (`Review`.`access` = 1) ' +
    'GROUP BY `Perfume`.`perfume_idx` ' +
    'HAVING COUNT(`Review`.`id`) >= :minReviewCount ' +
    'ORDER BY rand() ' +
    'LIMIT :size ';

const defaultOption: { [key: string]: any } = {
    include: [
        {
            model: Brand,
            as: 'Brand',
            required: true,
        },
    ],
    raw: true,
    nest: true,
};

class PerfumeDao {
    /**
     * 향수 조회
     *
     * @param {condition} condition
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<Perfume[]>} perfumeList
     */
    async readPerfume(
        sequelizeOption: any,
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        logger.debug(
            `${LOG_TAG} readNewPerfume(sequelizeOption = ${JSON.stringify(
                sequelizeOption
            )}, pagingDTO = ${pagingDTO})`
        );
        const options: { [key: string]: any } = Object.assign(
            {},
            defaultOption,
            {
                attributes: PERFUME_THUMB_COLUMNS,
                include: [
                    {
                        model: Brand,
                        as: 'Brand',
                    },
                ],
            },
            pagingDTO.sequelizeOption(),
            sequelizeOption
        );
        return Perfume.findAndCountAll(options).then((it: any) => {
            return new ListAndCountDTO(
                it.count,
                it.rows.map(PerfumeThumbDTO.createByJson)
            );
        });
    }

    /**
     * 향수 세부 조회
     *
     * @param {number} perfumeIdx
     * @returns {Promise<Perfume>}
     * @throws {NotMatchedError} if there is no Perfume
     */
    async readByPerfumeIdx(perfumeIdx: number): Promise<PerfumeDTO> {
        logger.debug(`${LOG_TAG} readByPerfumeIdx(perfumeIdx = ${perfumeIdx})`);
        const options = _.merge({}, defaultOption, {
            where: { perfumeIdx },
        });
        const perfume: { [key: string]: any } | null = await Perfume.findOne(
            options
        );
        if (!perfume) {
            throw new NotMatchedError();
        }
        perfume.volumeAndPrice = perfume.volumeAndPrice
            .split(',')
            .filter((str: string) => str.length > 0)
            .map((str: string) => {
                const [volume, price] = str.split('/');
                return { volume: parseInt(volume), price: parseInt(price) };
            });
        return PerfumeDTO.createByJson(perfume);
    }

    /**
     * 위시 리스트에 속하는 향수 조회
     *
     * @param {number} userIdx
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<Perfume[]>} perfumeList
     */
    async readLikedPerfume(
        userIdx: number,
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        logger.debug(
            `${LOG_TAG} readLikedPerfume(userIdx = ${userIdx}, pagingDTO = ${pagingDTO})`
        );
        const options: { [key: string]: any } = _.merge(
            {},
            defaultOption,
            pagingDTO.sequelizeOption(),
            {
                attributes: PERFUME_THUMB_COLUMNS,
            }
        );
        options.include.push({
            model: LikePerfume,
            as: 'PerfumeLike',
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            where: {
                userIdx,
            },
            required: true,
        });
        return Perfume.findAndCountAll(options).then((it: any) => {
            return new ListAndCountDTO(
                it.count,
                it.rows.map(PerfumeThumbDTO.createByJson)
            );
        });
    }

    /**
     * 최근에 검색한 향수 조회
     *
     * @param {number} userIdx
     * @param {PagingDTO} pagingDTO order is ignored
     * @returns {Promise<Perfume[]>}
     */
    async recentSearchPerfumeList(
        userIdx: number,
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<PerfumeInquireHistoryDTO>> {
        logger.debug(
            `${LOG_TAG} recentSearchPerfumeList(userIdx = ${userIdx}, pagingDTO = ${pagingDTO})`
        );
        try {
            const result: {
                rows: InquireHistory[];
                // todo: count에 배열이 아닌 number이 오게끔 수정
                count: { perfume_idx: number; count: number }[];
            } = (await InquireHistory.findAndCountAll(
                _.merge({}, pagingDTO.sequelizeOption(), {
                    raw: true,
                    nest: true,
                    attributes: {
                        include: [
                            [
                                Sequelize.fn(
                                    'max',
                                    Sequelize.col('InquireHistory.created_at')
                                ),
                                'inquireAt',
                            ],
                        ],
                    },
                    where: {
                        userIdx,
                    },
                    include: [
                        {
                            model: Perfume,
                            as: 'Perfume',
                            required: true,
                            include: [
                                {
                                    model: Brand,
                                    as: 'Brand',
                                    required: true,
                                },
                            ],
                            raw: true,
                            nest: true,
                        },
                    ],
                    order: [[sequelize.col('inquireAt'), 'desc']],
                    group: ['InquireHistory.perfume_idx'],
                })
            )) as any;

            const rows: PerfumeInquireHistoryDTO[] = result.rows
                .map((json: any) => {
                    return {
                        perfumeIdx: json.Perfume.perfumeIdx,
                        name: json.Perfume.name,
                        isLiked: json.Perfume.isLiked,
                        imageUrl: json.Perfume.imageUrl,
                        createdAt: json.Perfume.createdAt,
                        updatedAt: json.Perfume.updatedAt,
                        Brand: json.Perfume.Brand,
                        InquireHistory: {
                            userIdx: json.userIdx,
                            perfumeIdx: json.perfumeIdx,
                            createdAt: json.createdAt,
                            updatedAt: json.updatedAt,
                        },
                    };
                })
                .map(PerfumeInquireHistoryDTO.createByJson);
            return new ListAndCountDTO(result.count.length as number, rows);
        } catch (err) {
            throw err;
        }
    }

    /**
     * 비슷한 향수 추천 데이터 저장
     * @todo Consider error handling
     * @param {{[x: number]: number[]}} similarPerfumes
     * @returns {[err: number, result: number][]}
     */
    async updateSimilarPerfumes(similarPerfumes: {
        [x: number]: number[];
    }): Promise<[error: Error | null, result: unknown][] | null> {
        const obj = similarPerfumes;
        const multi = await redis.multi();

        for (const key in obj) {
            multi.del(`recs.perfume:${key}`);
            obj[key].forEach((v: any) => {
                multi.rpush(`recs.perfume:${key}`, v);
            });
        }
        return await multi.exec();
    }

    /**
     * 서베이 추천 향수 조회
     *
     * @param {number} gender
     * @returns {Promise<Perfume[]>}
     */
    async readPerfumeSurvey(
        gender: number | null
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        logger.debug(
            `${LOG_TAG} readPerfumeSurvey(gender = ${gender || 'all'})`
        );
        const options = _.merge({}, defaultOption);
        const where: any = gender
            ? {
                  gender,
              }
            : {};
        options.include.push({
            model: PerfumeSurvey,
            as: 'PerfumeSurvey',
            where,
            require: true,
        });
        return Perfume.findAndCountAll(options).then((it: any) => {
            return new ListAndCountDTO(
                it.count,
                it.rows.map(PerfumeThumbDTO.createByJson)
            );
        });
    }

    /**
     * 향수 전체 조회
     *
     * @returns {Promise<Perfume[]>}
     */
    async readAll(): Promise<Perfume[]> {
        logger.debug(`${LOG_TAG} readAll()`);
        return Perfume.findAll();
    }

    /**
     * 비슷한 향수 인덱스 목록 조회
     *
     * @todo Fix error handling
     * @param {number} perfumeIdx
     * @param {number} size
     * @returns {Promise<Perfume[]>}
     */
    async getSimilarPerfumeIdxList(
        perfumeIdx: number,
        size: number
    ): Promise<number[]> {
        logger.debug(
            `${LOG_TAG} getSimilarPerfumeIdxList(perfumeIdx = ${perfumeIdx}, size = ${size})`
        );

        const result = await redis.lrange(
            `recs.perfume:${perfumeIdx}`,
            0,
            size - 1
        );

        return result.map((it: string) => Number(it));
    }

    /**
     * 랜덤 향수 조회
     *
     * @param {number} size
     * @returns {Promise<PerfumeThumbDTO[]>}
     */
    async getPerfumesByRandom(size: number): Promise<PerfumeThumbDTO[]> {
        logger.debug(`${LOG_TAG} getPerfumesByRandom(size = ${size})`);
        const options: { [key: string]: any } = _.merge({}, defaultOption, {
            order: Sequelize.literal('rand()'),
            limit: size,
        });
        return Perfume.findAll(options).then((rows: any[]) => {
            return rows.map(PerfumeThumbDTO.createByJson);
        });
    }

    /**
     * 유효 시향기 n개 이상 보유 조건을 만족하는 랜덤 향수 조회
     *
     * @param {number} size
     * @param {number} minReviewCount
     * @returns {Promise<PerfumeThumbDTO[]>}
     */
    async getPerfumesWithMinReviewsByRandom(
        size: number,
        minReviewCount: number
    ): Promise<PerfumeThumbDTO[]> {
        logger.debug(
            `${LOG_TAG} getPerfumesWithMinReviewsByRandom(size = ${size}, minReviewCount = ${minReviewCount})`
        );
        const result: PerfumeThumbDTO[] =
            (await sequelize.query<PerfumeThumbDTO[]>(
                SQL_SEARCH_RANDOM_PERFUME_WITH_MIN_REVIEW_COUNT,
                Object.assign({
                    replacements: {
                        minReviewCount: minReviewCount,
                        size: size,
                    },
                    type: QueryTypes.SELECT,
                    raw: true,
                    nest: true,
                })
            )) || [];
        return result.map(PerfumeThumbDTO.createByJson);
    }

    /**
     * perfume idx list로 향수 조회
     *
     * @param {number[]} perfumeIdxList
     * @returns {Promise<Perfume[]>}
     */
    async getPerfumesByIdxList(
        perfumeIdxList: number[]
    ): Promise<PerfumeThumbDTO[]> {
        logger.debug(
            `${LOG_TAG} getPerfumesByIdxList(perfumeIdxList = ${perfumeIdxList})`
        );
        const options: { [key: string]: any } = _.merge({}, defaultOption, {
            where: {
                perfumeIdx: perfumeIdxList,
            },
        });
        return Perfume.findAll(options)
            .then((rows: any[]) => {
                return rows.map(PerfumeThumbDTO.createByJson);
            })
            .then((result: PerfumeThumbDTO[]) => {
                const perfumeThumbMap: { [key: number]: PerfumeThumbDTO } = {};
                result.forEach((it: PerfumeThumbDTO) => {
                    perfumeThumbMap[it.perfumeIdx] = it;
                });
                return perfumeIdxList
                    .filter((idx: number) => {
                        if (perfumeThumbMap[idx] == undefined) {
                            logger.warn('perfumeIdx(' + idx + ') is not exist');
                            return false;
                        }
                        return true;
                    })
                    .map((idx: number) => {
                        return perfumeThumbMap[idx];
                    });
            });
    }

    /**
     * 향수 전체 조회
     *
     * @returns {Promise<Perfume[]>}
     */
    async readPage(offset: number, limit: number, where?: WhereOptions) {
        logger.debug(`${LOG_TAG} readAll()`);
        return Perfume.findAndCountAll({
            offset,
            limit,
            include: [{ model: Brand, as: 'Brand' }],
            where,
            raw: true,
            nest: true,
            order: [['createdAt', 'desc']],
        });
    }
}

export default PerfumeDao;
