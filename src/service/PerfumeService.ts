import { logger } from '@modules/winston';

import { flatJob, removeKeyJob } from '@utils/func';

import PerfumeDao from '@dao/PerfumeDao';
import ReviewDao from '@dao/ReviewDao';
import UserDao from '@dao/UserDao';

import {
    ListAndCountDTO,
    PagingDTO,
    PerfumeDTO,
    PerfumeIntegralDTO,
    PerfumeSearchDTO,
    PerfumeSummaryDTO,
    PerfumeThumbDTO,
    PerfumeThumbKeywordDTO,
    PerfumeThumbWithReviewDTO,
    UserDTO,
} from '@dto/index';
import _ from 'lodash';
import fp from 'lodash/fp';
import { Op } from 'sequelize';
import { NoteService } from './NoteService';
import { LikePerfumeService } from './LikePerfumeService';
import ImageService from './ImageService';
import KeywordService from './KeywordService';
import SearchService from './SearchService';
import { PerfumeResponse } from '@src/controllers/definitions/response';
import {
    DuplicatedEntryError,
    FailedToCreateError,
} from '@src/utils/errors/errors';
const LOG_TAG: string = '[Perfume/Service]';
const DEFAULT_VALUE_OF_INDEX = 0;

let perfumeDao: PerfumeDao = new PerfumeDao();
let reviewDao: ReviewDao = new ReviewDao();
let userDao: UserDao = new UserDao();
let searchService = new SearchService();

export const commonJob = [
    removeKeyJob(
        'perfume_idx',
        'englishName',
        'brandIdx',
        'createdAt',
        'updatedAt'
    ),
];
class PerfumeService {
    likePerfumeService: LikePerfumeService;
    imageService: ImageService;
    keywordService: KeywordService;

    constructor(
        likePerfumeService?: LikePerfumeService,
        imageService?: ImageService,
        keywordService?: KeywordService
    ) {
        this.likePerfumeService =
            likePerfumeService ?? new LikePerfumeService();
        this.imageService = imageService ?? new ImageService();
        this.keywordService = keywordService ?? new KeywordService();
    }
    /**
     * 향수 세부 정보 조회
     *
     * @param {number} perfumeIdx
     * @param {number} userIdx
     * @returns {Promise<Perfume>}
     * @throws {NotMatchedError} if there is no Perfume
     **/
    async getPerfumeById(
        perfumeIdx: number,
        userIdx: number
    ): Promise<PerfumeIntegralDTO> {
        logger.debug(
            `${LOG_TAG} getPerfumeById(perfumeIdx = ${perfumeIdx}, userIdx = ${userIdx})`
        );
        let _perfume: PerfumeDTO = await perfumeDao.readByPerfumeIdx(
            perfumeIdx
        );
        const perfume: any = fp.compose(
            ...commonJob,
            flatJob('PerfumeDetail')
        )(_perfume);

        perfume.isLiked = await this.likePerfumeService.isLike(
            userIdx,
            perfumeIdx
        );
        const keywordList: string[] = [
            ...new Set<string>(
                (
                    await this.keywordService
                        .readAllOfPerfume(perfumeIdx)
                        .catch((_: Error) => [])
                ).map((it: any) => it.name)
            ),
        ];
        const imageUrls: string[] = await this.imageService.getImageList(
            perfumeIdx,
            perfume.imageUrl
        );

        const { noteType, noteDictDTO } = await new NoteService().generateNote(
            perfumeIdx
        );
        const perfumeSummaryDTO: PerfumeSummaryDTO = await this.generateSummary(
            perfumeIdx
        );

        const reviewIdx: number = await reviewDao
            .findOne({ userIdx, perfumeIdx })
            .then((it: any) => it.id || 0)
            .catch((_: Error) => 0);
        return PerfumeIntegralDTO.create(
            perfume,
            perfumeSummaryDTO,
            keywordList,
            noteDictDTO,
            noteType,
            imageUrls,
            reviewIdx
        );
    }

    async searchPerfume(
        perfumeSearchDTO: PerfumeSearchDTO,
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<PerfumeResponse>> {
        const result = await searchService.searchPerfume(
            perfumeSearchDTO,
            pagingDTO
        );
        const perfumeIdxList: number[] = result.rows.map((it) => it.perfumeIdx);
        const likePerfumeList: any[] =
            await this.likePerfumeService.readLikeInfo(
                perfumeSearchDTO.userIdx,
                perfumeIdxList
            );
        return result.convertType((item: PerfumeResponse): PerfumeResponse => {
            return this.likePerfumeService.isLikeJob(likePerfumeList)(item);
        });
    }

    /**
     * Survey 향수 조회
     *
     * @param {number} userIdx
     * @returns {Promise<Brand[]>}
     **/
    async getSurveyPerfume(
        userIdx: number
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        logger.debug(`${LOG_TAG} getSurveyPerfume(userIdx = ${userIdx})`);
        return userDao
            .readByIdx(userIdx)
            .then((it: UserDTO) => {
                return perfumeDao.readPerfumeSurvey(it.gender);
            })
            .then(async (result: ListAndCountDTO<PerfumeThumbDTO>) => {
                const perfumeIdxList = result.rows.map(
                    (it: PerfumeThumbDTO) => it.perfumeIdx
                );
                const likePerfumeList: any[] =
                    await this.likePerfumeService.readLikeInfo(
                        userIdx,
                        perfumeIdxList
                    );
                return result.convertType((item: PerfumeThumbDTO) => {
                    return fp.compose(
                        ...commonJob,
                        this.likePerfumeService.isLikeJob(likePerfumeList),
                        PerfumeThumbDTO.createByJson
                    )(item);
                });
            });
    }

    /**
     * 비슷한 향수 추천 데이터 저장
     * @todo Fix error handling
     * @todo Fix type annotations
     * @param {Object} perfumeSimilarRequest
     * @returns {Promise}
     **/
    async updateSimilarPerfumes(perfumeSimilarRequest: any): Promise<any> {
        logger.debug(
            `${LOG_TAG} updateSimilarPerfumes(perfumeSimilarRequest = ${perfumeSimilarRequest})`
        );

        return await perfumeDao.updateSimilarPerfumes(perfumeSimilarRequest);
    }

    /**
     * 유저의 최근 검색한 향수 조회
     *
     * @param {number} userIdx
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<Perfume[]>}
     **/
    async recentSearch(
        userIdx: number,
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        logger.debug(
            `${LOG_TAG} recentSearch(userIdx = ${userIdx}, pagingDTO = ${pagingDTO})`
        );
        return perfumeDao
            .recentSearchPerfumeList(userIdx, pagingDTO)
            .then(async (result) => {
                const perfumeIdxList: number[] = result.rows.map(
                    (it) => it.perfumeIdx
                );
                const likePerfumeList: any[] =
                    await this.likePerfumeService.readLikeInfo(
                        userIdx,
                        perfumeIdxList
                    );
                return result.convertType((item: PerfumeThumbDTO) => {
                    return fp.compose(
                        ...commonJob,
                        this.likePerfumeService.isLikeJob(likePerfumeList),
                        PerfumeThumbDTO.createByJson
                    )(item);
                });
            });
    }

    /**
     * 새로 추가된 향수 조회
     *
     * @param {number} userIdx
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<Perfume[]>}
     **/
    getNewPerfume(
        userIdx: number,
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        logger.debug(
            `${LOG_TAG} getNewPerfume(userIdx = ${userIdx}, pagingDTO = ${pagingDTO})`
        );
        pagingDTO = Object.assign(pagingDTO, {
            order: [['createdAt', 'desc']],
        });
        return perfumeDao
            .readPerfume(undefined, pagingDTO)
            .then(
                async (
                    result: ListAndCountDTO<PerfumeThumbDTO>
                ): Promise<ListAndCountDTO<PerfumeThumbDTO>> => {
                    const perfumeIdxList: number[] = result.rows.map(
                        (it: PerfumeThumbDTO) => it.perfumeIdx
                    );
                    const likePerfumeList: any[] =
                        await this.likePerfumeService.readLikeInfo(
                            userIdx,
                            perfumeIdxList
                        );
                    return result.convertType((item: PerfumeThumbDTO) => {
                        return fp.compose(
                            ...commonJob,
                            this.likePerfumeService.isLikeJob(likePerfumeList),
                            PerfumeThumbDTO.createByJson
                        )(item);
                    });
                }
            );
    }

    /**
     * 유저가 좋아요한 향수 조회
     *
     * @param {number} userIdx
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<Perfume[]>}
     **/
    getLikedPerfume(
        userIdx: number,
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<PerfumeThumbWithReviewDTO>> {
        logger.debug(
            `${LOG_TAG} getLikedPerfume(userIdx = ${userIdx}, pagingDTO = ${pagingDTO})`
        );
        return perfumeDao
            .readLikedPerfume(userIdx, pagingDTO)
            .then(async (result: any) => {
                const perfumeIdxList: number[] = result.rows.map(
                    (it: any) => it.perfumeIdx
                );
                const likePerfumeList: any[] =
                    await this.likePerfumeService.readLikeInfo(
                        userIdx,
                        perfumeIdxList
                    );
                const perfumeReviewList: any[] =
                    await reviewDao.readAllMineOfPerfumes(
                        userIdx,
                        perfumeIdxList
                    );
                return result.convertType((item: any) => {
                    return fp.compose(
                        ...commonJob,
                        this.likePerfumeService.isLikeJob(likePerfumeList),
                        this.matchReviewsWithPerfumesJob(perfumeReviewList),
                        PerfumeThumbWithReviewDTO.createByJson
                    )(item);
                });
            });
    }

    /**
     * 비슷한 향수 추천 목록 조회
     *
     * @todo Fix error handling
     * @param {number} perfumeIdx
     * @param {number} size
     * @returns {Promise<PerfumeThumbKeywordDTO[]>}
     **/
    async getRecommendedSimilarPerfumeList(
        perfumeIdx: number,
        size: number
    ): Promise<ListAndCountDTO<PerfumeThumbKeywordDTO>> {
        let perfumeList: PerfumeThumbDTO[];

        const perfumeIdxList: number[] =
            await perfumeDao.getSimilarPerfumeIdxList(perfumeIdx, size);

        if (perfumeIdxList.length > 0) {
            perfumeList = await perfumeDao.getPerfumesByIdxList(perfumeIdxList);
        } else {
            perfumeList = await perfumeDao.getPerfumesByRandom(size);
        }
        return this.convertToThumbKeyword(
            new ListAndCountDTO<PerfumeThumbDTO>(
                perfumeList.length,
                perfumeList
            )
        );
    }

    /**
     * 랜덤 향수 조회
     * minReviewCount 지정시, 유효 시향기 n개 이상 보유 조건을 만족하는 향수 조회
     *
     * @param {number} size
     * @param {number} minReviewCount
     * @returns {Promise<ListAndCountDTO<PerfumeThumbDTO>>}
     **/
    async getPerfumesByRandom(
        size: number,
        minReviewCount: number = 0
    ): Promise<ListAndCountDTO<PerfumeThumbKeywordDTO>> {
        logger.debug(`${LOG_TAG} getPerfumesByRandom(size = ${size})`);
        let result: PerfumeThumbDTO[] = [];

        if (minReviewCount == 0) {
            result = await perfumeDao.getPerfumesByRandom(size);
        }
        if (minReviewCount > 0) {
            result = await perfumeDao.getPerfumesWithMinReviewsByRandom(
                size,
                minReviewCount
            );
        }

        return await this.convertToThumbKeyword(
            new ListAndCountDTO<PerfumeThumbDTO>(result.length, result)
        );
    }

    /**
     * perfumeIdx로 향수 조회
     *
     * @param {number[]} perfumeIdxList
     * @param {number} userIdx
     * @returns {Promise<PerfumeThumbKeywordDTO[]>}
     **/
    async getPerfumesByIdxList(
        perfumeIdxList: number[],
        userIdx: number
    ): Promise<PerfumeThumbKeywordDTO[]> {
        const converter: (item: PerfumeThumbDTO) => PerfumeThumbKeywordDTO =
            await this.keywordService.getPerfumeThumbKeywordConverter(
                perfumeIdxList,
                userIdx
            );
        return perfumeDao
            .getPerfumesByIdxList(perfumeIdxList)
            .then((result: PerfumeThumbDTO[]): PerfumeThumbKeywordDTO[] => {
                return result.map(converter);
            });
    }

    setReviewDao(dao: any) {
        reviewDao = dao;
    }

    setUserDao(dao: UserDao) {
        userDao = dao;
    }

    private async generateSummary(
        perfumeIdx: number
    ): Promise<PerfumeSummaryDTO> {
        const reviewList = await reviewDao.readAllOfPerfume(perfumeIdx, true);
        const userSummary = PerfumeSummaryDTO.createByReviewList(reviewList);
        return userSummary;
    }

    private matchReviewsWithPerfumesJob(
        perfumeReviewList: any[]
    ): (obj: any) => any {
        const reviewMap: { [key: string]: any } = _.chain(perfumeReviewList)
            .groupBy('perfumeIdx')
            .mapValues((arr) => arr.map((it) => it))
            .value();

        return (obj: any) => {
            const ret: any = Object.assign({}, obj); // obj 복사본 생성
            ret.reviewIdx = reviewMap[obj.perfumeIdx]
                ? reviewMap[obj.perfumeIdx][0]['id']
                : DEFAULT_VALUE_OF_INDEX;
            return ret;
        };
    }

    private async convertToThumbKeyword(
        result: ListAndCountDTO<PerfumeThumbDTO>,
        userIdx: number = -1
    ): Promise<ListAndCountDTO<PerfumeThumbKeywordDTO>> {
        const perfumeIdxList = result.rows.map((it) => it.perfumeIdx);
        const converter: (item: PerfumeThumbDTO) => PerfumeThumbKeywordDTO =
            await this.keywordService.getPerfumeThumbKeywordConverter(
                perfumeIdxList,
                userIdx
            );

        return result.convertType((item: PerfumeThumbDTO) => {
            return converter(item);
        });
    }

    async readPage(
        offset: number,
        limit: number,
        query: any
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        const { target, keyword } = query;
        const whereOptions = {} as any;
        if (target && keyword) {
            switch (target) {
                case 'id':
                    whereOptions.perfumeIdx = keyword;
                    break;
                case 'name':
                    whereOptions.name = { [Op.startsWith]: keyword };
                    break;
                case 'englishName':
                    whereOptions.englishName = { [Op.startsWith]: keyword };
                    break;
            }
        }

        const { rows, count } = await perfumeDao.readPage(
            offset,
            limit,
            whereOptions
        );
        const list = rows.map((c) => PerfumeThumbDTO.createByJson(c));
        return new ListAndCountDTO(count, list);
    }

    async create(
        name: string,
        englishName: string,
        brandIdx: number,
        abundanceRate: number,
        Notes: Array<any>,
        imageUrl: string
    ) {
        try {
            return await perfumeDao.create(
                name,
                englishName,
                brandIdx,
                abundanceRate,
                Notes,
                imageUrl
            );
        } catch (err: Error | any) {
            if (err.parent?.errno === 1062) {
                throw new DuplicatedEntryError();
            }
            throw new FailedToCreateError();
        }
    }
}

export default PerfumeService;
