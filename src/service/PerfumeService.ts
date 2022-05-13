import { logger } from '@modules/winston';

import { NotMatchedError, FailedToCreateError } from '@errors';

import { removeKeyJob, flatJob } from '@utils/func';
import {
    GENDER_WOMAN,
    PERFUME_NOTE_TYPE_SINGLE,
    PERFUME_NOTE_TYPE_NORMAL,
    DEFAULT_REVIEW_THRESHOLD,
} from '@utils/constants';

import UserDao from '@dao/UserDao';
import PerfumeDao from '@dao/PerfumeDao';
import PerfumeDefaultReviewDao from '@dao/PerfumeDefaultReviewDao';
import NoteDao from '@dao/NoteDao';
import LikePerfumeDao from '@dao/LikePerfumeDao';
import S3FileDao from '@dao/S3FileDao';

import {
    PagingDTO,
    ListAndCountDTO,
    PerfumeThumbDTO,
    PerfumeThumbKeywordDTO,
    PerfumeSummaryDTO,
    PerfumeSearchDTO,
    PerfumeIntegralDTO,
    PerfumeDTO,
    PerfumeSearchResultDTO,
    UserDTO,
    NoteDictDTO,
    PerfumeDefaultReviewDTO,
} from '@dto/index';
import fp from 'lodash/fp';
import _ from 'lodash';

const LOG_TAG: string = '[Perfume/Service]';

let perfumeDao: PerfumeDao = new PerfumeDao();
let reviewDao = require('@dao/ReviewDao.js');
let noteDao: NoteDao = new NoteDao();
let likePerfumeDao: LikePerfumeDao = new LikePerfumeDao();
let keywordDao = require('@dao/KeywordDao.js');
let defaultReviewDao: PerfumeDefaultReviewDao = new PerfumeDefaultReviewDao();
let s3FileDao: S3FileDao = new S3FileDao();
let userDao: UserDao = new UserDao();

const commonJob = [
    removeKeyJob(
        'perfume_idx',
        'englishName',
        'brandIdx',
        'createdAt',
        'updatedAt'
    ),
];
class PerfumeService {
    /**
     * 향수 세부 정보 조회
     *
     * @param {number} perfumeIdx
     * @param {number} userIdx
     * @returns {Promise<Perfume>}
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

        const defaultReviewDTO: PerfumeDefaultReviewDTO | null =
            await defaultReviewDao
                .readByPerfumeIdx(perfumeIdx)
                .catch((_: Error) => {
                    return null;
                });
        perfume.isLiked = await this.isLike(userIdx, perfumeIdx);
        const keywordList: string[] = [
            ...new Set<string>(
                (await keywordDao.readAllOfPerfume(perfumeIdx))
                    .concat(
                        defaultReviewDTO ? defaultReviewDTO.keywordList : []
                    )
                    .map((it: any) => it.name)
            ),
        ];
        const imageUrls: string[] = [
            perfume.imageUrl,
            ...(await s3FileDao.getS3ImageList(perfumeIdx)),
        ];

        const { noteType, noteDictDTO } = await this.generateNote(perfumeIdx);
        const perfumeSummaryDTO: PerfumeSummaryDTO = await this.generateSummary(
            perfumeIdx,
            defaultReviewDTO
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

    /**
     * 향수 검색
     *
     * @param {PerfumeSearchDTO} perfumeSearchDTO
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<Perfume[]>}
     **/
    async searchPerfume(
        perfumeSearchDTO: PerfumeSearchDTO,
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<PerfumeSearchResultDTO>> {
        logger.debug(
            `${LOG_TAG} searchPerfume(perfumeSearchDTO = ${perfumeSearchDTO}, pagingDTO = ${pagingDTO})`
        );
        return perfumeDao
            .search(
                perfumeSearchDTO.brandIdxList,
                perfumeSearchDTO.ingredientIdxList,
                perfumeSearchDTO.keywordIdxList,
                perfumeSearchDTO.searchText,
                pagingDTO
            )
            .then(
                async (
                    result: ListAndCountDTO<PerfumeSearchResultDTO>
                ): Promise<ListAndCountDTO<PerfumeSearchResultDTO>> => {
                    const perfumeIdxList: number[] = result.rows.map(
                        (it) => it.perfumeIdx
                    );
                    const likePerfumeList: any[] =
                        await likePerfumeDao.readLikeInfo(
                            perfumeSearchDTO.userIdx,
                            perfumeIdxList
                        );
                    return result.convertType(
                        (
                            item: PerfumeSearchResultDTO
                        ): PerfumeSearchResultDTO => {
                            return fp.compose(
                                ...commonJob,
                                this.isLikeJob(likePerfumeList),
                                PerfumeSearchResultDTO.createByJson
                            )(item);
                        }
                    );
                }
            );
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
                    await likePerfumeDao.readLikeInfo(userIdx, perfumeIdxList);
                return result.convertType((item: PerfumeThumbDTO) => {
                    return fp.compose(
                        ...commonJob,
                        this.isLikeJob(likePerfumeList),
                        PerfumeThumbDTO.createByJson
                    )(item);
                });
            });
    }

    /**
     * 향수 좋아요
     *
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @returns {Promise}
     **/
    likePerfume(userIdx: number, perfumeIdx: number): Promise<boolean> {
        logger.debug(
            `${LOG_TAG} likePerfume(userIdx = ${userIdx}, perfumeIdx = ${perfumeIdx})`
        );
        return likePerfumeDao
            .read(userIdx, perfumeIdx)
            .then((_: any) => {
                return likePerfumeDao
                    .delete(userIdx, perfumeIdx)
                    .then((_: number) => true);
            })
            .catch((err: Error) => {
                if (err instanceof NotMatchedError) {
                    return likePerfumeDao
                        .create(userIdx, perfumeIdx)
                        .then(() => false);
                }
                throw new FailedToCreateError();
            })
            .then((exist: boolean) => {
                return !exist;
            })
            .catch((err: Error) => {
                throw err;
            });
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
                    await likePerfumeDao.readLikeInfo(userIdx, perfumeIdxList);
                return result.convertType((item: PerfumeThumbDTO) => {
                    return fp.compose(
                        ...commonJob,
                        this.isLikeJob(likePerfumeList),
                        PerfumeThumbDTO.createByJson
                    )(item);
                });
            });
    }

    /**
     * 유저 연령대 및 성별에 따른 향수 추천
     *
     * @param {number} userIdx
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<Perfume[]>}
     **/
    async recommendByUser(
        userIdx: number,
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<PerfumeThumbKeywordDTO>> {
        logger.debug(
            `${LOG_TAG} recommendByUser(userIdx = ${userIdx}, pagingDTO = ${pagingDTO})`
        );
        const { ageGroup, gender } = await this.getAgeGroupAndGender(userIdx);

        const recommendedListPromise: Promise<
            ListAndCountDTO<PerfumeThumbDTO>
        > = this.recommendByGenderAgeAndGender(gender, ageGroup, pagingDTO);

        return recommendedListPromise.then(
            async (
                result: ListAndCountDTO<PerfumeThumbDTO>
            ): Promise<ListAndCountDTO<PerfumeThumbKeywordDTO>> => {
                const perfumeIdxList: number[] = result.rows.map(
                    (it: PerfumeThumbDTO) => it.perfumeIdx
                );
                let likePerfumeList: any[] = [];
                if (userIdx > -1) {
                    likePerfumeList = await likePerfumeDao.readLikeInfo(
                        userIdx,
                        perfumeIdxList
                    );
                }

                const joinKeywordList: any[] =
                    await keywordDao.readAllOfPerfumeIdxList(perfumeIdxList);

                return result.convertType((item: PerfumeThumbDTO) => {
                    return fp.compose(
                        ...commonJob,
                        this.isLikeJob(likePerfumeList),
                        this.addKeyword(joinKeywordList),
                        PerfumeThumbKeywordDTO.createByJson
                    )(item);
                });
            }
        );
    }

    /**
     * 유저 연령대 및 성별에 따른 향수 추천
     *
     * @param {number} gender
     * @param {number} ageGroup
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<Perfume[]>}
     **/
    recommendByGenderAgeAndGender(
        gender: number,
        ageGroup: number,
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        logger.debug(
            `${LOG_TAG} recommendByGenderAgeAndGender(gender = ${gender}, ageGroup = ${ageGroup}, pagingDTO = ${pagingDTO})`
        );
        return perfumeDao.recommendPerfumeByAgeAndGender(
            gender,
            ageGroup,
            pagingDTO
        );
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
                        await likePerfumeDao.readLikeInfo(
                            userIdx,
                            perfumeIdxList
                        );
                    return result.convertType((item: PerfumeThumbDTO) => {
                        return fp.compose(
                            ...commonJob,
                            this.isLikeJob(likePerfumeList),
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
     * @param {PagingDTO} pagpagingDTOingRequestDTO
     * @returns {Promise<Perfume[]>}
     **/
    getLikedPerfume(
        userIdx: number,
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        logger.debug(
            `${LOG_TAG} getLikedPerfume(userIdx = ${userIdx}, pagingDTO = ${pagingDTO})`
        );
        return perfumeDao
            .readLikedPerfume(userIdx, pagingDTO)
            .then(async (result: ListAndCountDTO<PerfumeThumbDTO>) => {
                const perfumeIdxList: number[] = result.rows.map(
                    (it: PerfumeThumbDTO) => it.perfumeIdx
                );
                const likePerfumeList: any[] =
                    await likePerfumeDao.readLikeInfo(userIdx, perfumeIdxList);
                return result.convertType((item: PerfumeThumbDTO) => {
                    return fp.compose(
                        ...commonJob,
                        this.isLikeJob(likePerfumeList),
                        PerfumeThumbDTO.createByJson
                    )(item);
                });
            });
    }

    setPerfumeDao(dao: PerfumeDao) {
        perfumeDao = dao;
    }

    setReviewDao(dao: any) {
        reviewDao = dao;
    }

    setNoteDao(dao: NoteDao) {
        noteDao = dao;
    }

    setLikePerfumeDao(dao: LikePerfumeDao) {
        likePerfumeDao = dao;
    }

    setKeywordDao(dao: any) {
        keywordDao = dao;
    }

    setUserDao(dao: UserDao) {
        userDao = dao;
    }

    setS3FileDao(dao: S3FileDao) {
        s3FileDao = dao;
    }

    setDefaultReviewDao(dao: PerfumeDefaultReviewDao) {
        defaultReviewDao = dao;
    }

    getDefaultReviewRate(x: number) {
        return 1 - Math.max(0, x / DEFAULT_REVIEW_THRESHOLD);
    }

    private async getAgeGroupAndGender(
        userIdx: number
    ): Promise<{ gender: number; ageGroup: number }> {
        if (userIdx == -1) {
            return {
                gender: GENDER_WOMAN,
                ageGroup: 20,
            };
        }
        const user: UserDTO = await userDao.readByIdx(userIdx);
        const today: Date = new Date();
        const age: number = today.getFullYear() - user.birth + 1;
        const gender: number = user.gender;
        const ageGroup: number = Math.floor(age / 10) * 10;
        return { gender, ageGroup };
    }

    private async generateNote(perfumeIdx: number): Promise<{
        noteType: number;
        noteDictDTO: {
            top: string;
            middle: string;
            base: string;
            single: string;
        };
    }> {
        const noteList: any[] = await noteDao.readByPerfumeIdx(perfumeIdx);
        const noteDictDTO: {
            top: string;
            middle: string;
            base: string;
            single: string;
        } = NoteDictDTO.createByNoteList(noteList);
        const noteType: number =
            noteDictDTO.single.length > 0
                ? PERFUME_NOTE_TYPE_SINGLE
                : PERFUME_NOTE_TYPE_NORMAL;
        return { noteType, noteDictDTO };
    }

    private async generateSummary(
        perfumeIdx: number,
        defaultReviewDTO: any
    ): Promise<PerfumeSummaryDTO> {
        const reviewList = await reviewDao.readAllOfPerfume(perfumeIdx);
        const userSummary = PerfumeSummaryDTO.createByReviewList(reviewList);
        if (!defaultReviewDTO) {
            return userSummary;
        }
        const defaultSummary =
            PerfumeSummaryDTO.createByDefault(defaultReviewDTO);
        const defaultReviewRate = this.getDefaultReviewRate(reviewList.length);
        return PerfumeSummaryDTO.merge(
            defaultSummary,
            userSummary,
            defaultReviewRate
        );
    }

    private isLike(userIdx: number, perfumeIdx: number): Promise<boolean> {
        return likePerfumeDao
            .read(userIdx, perfumeIdx)
            .then((_: any) => true)
            .catch((err: Error) => {
                if (err instanceof NotMatchedError) {
                    return false;
                }
                throw err;
            });
    }

    private isLikeJob(likePerfumeList: any[]): (obj: any) => any {
        const likeMap: { [key: string]: boolean } = _.chain(likePerfumeList)
            .keyBy('perfumeIdx')
            .mapValues(() => true)
            .value();

        return (obj: any) => {
            const ret: any = Object.assign({}, obj);
            ret.isLiked = likeMap[obj.perfumeIdx] ? true : false;
            return ret;
        };
    }

    private addKeyword(joinKeywordList: any[]): (obj: any) => any {
        const keywordMap: { [key: number]: string[] } = _.chain(joinKeywordList)
            .groupBy('perfumeIdx')
            .mapValues((arr) => arr.map((it) => it.Keyword.name))
            .value();

        return (obj: any) => {
            const ret: any = Object.assign({}, obj);
            ret.keywordList = keywordMap[obj.perfumeIdx] || [];
            return ret;
        };
    }
}

export default PerfumeService;
