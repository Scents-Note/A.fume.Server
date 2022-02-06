import { logger } from '@modules/winston';

import { NotMatchedError, FailedToCreateError } from '@errors';

import { updateRows, removeKeyJob, flatJob } from '@utils/func';
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

import { PagingRequestDTO } from '@request/common';
import { PerfumeSearchRequest } from '@request/perfume';

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
        const perfume: any = [...commonJob, flatJob('PerfumeDetail')].reduce(
            (prev, cur) => cur(prev),
            _perfume
        );

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
     * @param {PerfumeSearchRequest} perfumeSearchRequest
     * @param {PagingRequestDTO} pagingRequestDTO
     * @returns {Promise<Perfume[]>}
     **/
    async searchPerfume(
        perfumeSearchRequest: PerfumeSearchRequest,
        pagingRequestDTO: PagingRequestDTO
    ): Promise<ListAndCountDTO<PerfumeSearchResultDTO>> {
        logger.debug(
            `${LOG_TAG} searchPerfume(perfumeSearchRequest = ${perfumeSearchRequest}, pagingRequestDTO = ${pagingRequestDTO})`
        );
        const pagingDTO: PagingDTO = PagingDTO.create(pagingRequestDTO);
        const perfumeSearchDTO: PerfumeSearchDTO =
            PerfumeSearchDTO.create(perfumeSearchRequest);
        return perfumeDao
            .search(
                perfumeSearchDTO.brandIdxList,
                perfumeSearchDTO.ingredientIdxList,
                perfumeSearchDTO.keywordIdxList,
                perfumeSearchDTO.searchText,
                pagingDTO.pagingIndex,
                pagingDTO.pagingSize,
                pagingDTO.order
            )
            .then(async (result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
                const perfumeIdxList: number[] = result.rows.map(
                    (it) => it.perfumeIdx
                );
                const likePerfumeList: any[] =
                    await likePerfumeDao.readLikeInfo(
                        perfumeSearchDTO.userIdx,
                        perfumeIdxList
                    );
                updateRows(
                    result,
                    ...commonJob,
                    this.isLikeJob(likePerfumeList)
                );
                return new ListAndCountDTO<PerfumeSearchResultDTO>(
                    result.count,
                    result.rows
                );
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
                    await likePerfumeDao.readLikeInfo(userIdx, perfumeIdxList);
                updateRows(
                    result,
                    ...commonJob,
                    this.isLikeJob(likePerfumeList)
                );
                return new ListAndCountDTO<PerfumeThumbDTO>(
                    result.count,
                    result.rows.map(PerfumeThumbDTO.createByJson)
                );
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
     * @param {PagingRequestDTO} pagingRequestDTO
     * @returns {Promise<Perfume[]>}
     **/
    async recentSearch(
        userIdx: number,
        pagingRequestDTO: PagingRequestDTO
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        logger.debug(
            `${LOG_TAG} recentSearch(userIdx = ${userIdx}, pagingRequestDTO = ${pagingRequestDTO})`
        );
        const { pagingIndex, pagingSize } = PagingDTO.create(pagingRequestDTO);
        return perfumeDao
            .recentSearchPerfumeList(userIdx, pagingIndex, pagingSize)
            .then(async (result) => {
                const perfumeIdxList: number[] = result.rows.map(
                    (it) => it.perfumeIdx
                );
                const likePerfumeList: any[] =
                    await likePerfumeDao.readLikeInfo(userIdx, perfumeIdxList);
                updateRows(
                    result,
                    ...commonJob,
                    this.isLikeJob(likePerfumeList)
                );
                return new ListAndCountDTO<PerfumeThumbDTO>(
                    result.count,
                    result.rows.map(PerfumeThumbDTO.createByJson)
                );
            });
    }

    /**
     * 유저 연령대 및 성별에 따른 향수 추천
     *
     * @param {number} userIdx
     * @param {number} pagingRequestDTO
     * @returns {Promise<Perfume[]>}
     **/
    async recommendByUser(
        userIdx: number,
        pagingRequestDTO: PagingRequestDTO
    ): Promise<ListAndCountDTO<PerfumeThumbKeywordDTO>> {
        logger.debug(
            `${LOG_TAG} recommendByUser(userIdx = ${userIdx}, pagingRequestDTO = ${pagingRequestDTO})`
        );
        const { ageGroup, gender } = await this.getAgeGroupAndGender(userIdx);

        const recommendedListPromise: Promise<
            ListAndCountDTO<PerfumeThumbDTO>
        > = this.recommendByGenderAgeAndGender(
            gender,
            ageGroup,
            pagingRequestDTO
        );

        return recommendedListPromise.then(
            async (result: ListAndCountDTO<PerfumeThumbDTO>) => {
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

                updateRows(
                    result,
                    ...commonJob,
                    this.isLikeJob(likePerfumeList),
                    this.addKeyword(joinKeywordList)
                );
                return new ListAndCountDTO<PerfumeThumbKeywordDTO>(
                    result.count,
                    result.rows.map(PerfumeThumbKeywordDTO.createByJson)
                );
            }
        );
    }

    /**
     * 유저 연령대 및 성별에 따른 향수 추천
     *
     * @param {number} gender
     * @param {number} ageGroup
     * @param {number} pagingIndex
     * @param {number} pagingSize
     * @returns {Promise<Perfume[]>}
     **/
    recommendByGenderAgeAndGender(
        gender: number,
        ageGroup: number,
        pagingRequestDTO: PagingRequestDTO
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        logger.debug(
            `${LOG_TAG} recommendByGenderAgeAndGender(gender = ${gender}, ageGroup = ${ageGroup}, pagingRequestDTO = ${pagingRequestDTO})`
        );
        const { pagingIndex, pagingSize } = PagingDTO.create(pagingRequestDTO);
        return perfumeDao.recommendPerfumeByAgeAndGender(
            gender,
            ageGroup,
            pagingIndex,
            pagingSize
        );
    }

    /**
     * 새로 추가된 향수 조회
     *
     * @param {number} userIdx
     * @param {number} pagingRequestDTO
     * @returns {Promise<Perfume[]>}
     **/
    getNewPerfume(
        userIdx: number, // TODO userIdx 삭제하기
        pagingRequestDTO: PagingRequestDTO
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        logger.debug(
            `${LOG_TAG} getNewPerfume(userIdx = ${userIdx}, pagingRequestDTO = ${pagingRequestDTO})`
        );
        const pagingDTO: PagingDTO = PagingDTO.create(pagingRequestDTO);
        const fromDate: Date = new Date();
        fromDate.setDate(fromDate.getDate() - 7);
        return perfumeDao
            .readNewPerfume(
                fromDate,
                pagingDTO.pagingIndex,
                pagingDTO.pagingSize
            )
            .then(async (result: ListAndCountDTO<PerfumeThumbDTO>) => {
                const perfumeIdxList: number[] = result.rows.map(
                    (it: PerfumeThumbDTO) => it.perfumeIdx
                );
                const likePerfumeList: any[] =
                    await likePerfumeDao.readLikeInfo(userIdx, perfumeIdxList);
                updateRows(
                    result,
                    ...commonJob,
                    this.isLikeJob(likePerfumeList)
                );

                return new ListAndCountDTO<PerfumeThumbDTO>(
                    result.count,
                    result.rows.map(PerfumeThumbDTO.createByJson)
                );
            });
    }

    /**
     * 유저가 좋아요한 향수 조회
     *
     * @param {number} userIdx
     * @param {number} pagingRequestDTO
     * @returns {Promise<Perfume[]>}
     **/
    getLikedPerfume(
        userIdx: number,
        pagingRequestDTO: PagingRequestDTO
    ): Promise<ListAndCountDTO<PerfumeThumbDTO>> {
        logger.debug(
            `${LOG_TAG} getLikedPerfume(userIdx = ${userIdx}, pagingRequestDTO = ${pagingRequestDTO})`
        );
        const pagingDTO: PagingDTO = PagingDTO.create(pagingRequestDTO);
        return perfumeDao
            .readLikedPerfume(
                userIdx,
                pagingDTO.pagingIndex,
                pagingDTO.pagingSize
            )
            .then(async (result: ListAndCountDTO<PerfumeThumbDTO>) => {
                const perfumeIdxList: number[] = result.rows.map(
                    (it: PerfumeThumbDTO) => it.perfumeIdx
                );
                const likePerfumeList: any[] =
                    await likePerfumeDao.readLikeInfo(userIdx, perfumeIdxList);
                updateRows(
                    result,
                    ...commonJob,
                    this.isLikeJob(likePerfumeList)
                );
                return new ListAndCountDTO<PerfumeThumbDTO>(
                    result.count,
                    result.rows.map(PerfumeThumbDTO.createByJson)
                );
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
        const likeMap: { [key: string]: boolean } = likePerfumeList.reduce(
            (prev: { [key: string]: boolean }, cur: any) => {
                prev[cur.perfumeIdx] = true;
                return prev;
            },
            {}
        );
        return (obj: any) => {
            const ret: any = Object.assign({}, obj);
            ret.isLiked = likeMap[obj.perfumeIdx] ? true : false;
            return ret;
        };
    }

    private addKeyword(joinKeywordList: any[]): (obj: any) => any {
        const keywordMap: { [key: number]: string[] } = joinKeywordList.reduce(
            (prev: { [key: number]: string[] }, cur: any) => {
                if (!prev[cur.perfumeIdx]) prev[cur.perfumeIdx] = [];
                prev[cur.perfumeIdx].push(cur.Keyword.name);
                return prev;
            },
            {}
        );

        return (obj: any) => {
            const ret: any = Object.assign({}, obj);
            ret.keywordList = keywordMap[obj.perfumeIdx] || [];
            return ret;
        };
    }
}

export default PerfumeService;
