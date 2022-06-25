import { logger } from '@modules/winston';
import _, { Dictionary } from 'lodash';

import IngredientDao from '@dao/IngredientDao';
import IngredientCategoryDao from '@src/dao/IngredientCategoryDao';
import SeriesDao from '@dao/SeriesDao';
import NoteDao from '@dao/NoteDao';

import {
    PagingDTO,
    IngredientDTO,
    ListAndCountDTO,
    SeriesDTO,
    SeriesFilterDTO,
    IngredientCategoryDTO,
} from '@dto/index';
import { THRESHOLD_CATEGORY } from '@src/utils/constants';
import { Op } from 'sequelize';

const LOG_TAG: string = '[Series/Service]';

class SeriesService {
    seriesDao: SeriesDao;
    ingredientDao: IngredientDao;
    ingredientCategoryDao: IngredientCategoryDao;
    noteDao: any;
    constructor(
        seriesDao?: SeriesDao,
        ingredientDao?: IngredientDao,
        ingredientCategoryDao?: IngredientCategoryDao,
        noteDao?: any
    ) {
        this.seriesDao = seriesDao ?? new SeriesDao();
        this.ingredientDao = ingredientDao ?? new IngredientDao();
        this.ingredientCategoryDao =
            ingredientCategoryDao ?? new IngredientCategoryDao();
        this.noteDao = noteDao ?? new NoteDao();
    }

    /**
     * 특정 계열 조회
     *
     * @param {integer} seriesIdx
     * @returns {Promise<SeriesDTO>} seriesDTO
     * @throws {NotMatchedError} if there is no series
     **/
    getSeriesByIdx(seriesIdx: number): Promise<SeriesDTO> {
        logger.debug(`${LOG_TAG} getSeriesByIdx(seriesIdx = ${seriesIdx})`);
        return this.seriesDao.readByIdx(seriesIdx);
    }

    /**
     * 계열 전체 목록 조회
     *
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<ListAndCountDTO<SeriesDTO>>} listAndCountDTO
     **/
    getSeriesAll(pagingDTO: PagingDTO): Promise<ListAndCountDTO<SeriesDTO>> {
        logger.debug(`${LOG_TAG} getSeriesAll(pagingDTO = ${pagingDTO})`);
        return this.seriesDao.readAll(pagingDTO);
    }

    /**
     * 계열 검색
     *
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<ListAndCountDTO<SeriesDTO>>} listAndCountDTO
     **/
    searchSeries(pagingDTO: PagingDTO): Promise<ListAndCountDTO<SeriesDTO>> {
        logger.debug(`${LOG_TAG} searchSeries(pagingDTO = ${pagingDTO})`);
        return this.seriesDao.search(pagingDTO);
    }

    /**
     * 필터에서 보여주는 Series 조회
     *
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<ListAndCountDTO<SeriesFilterDTO>>} listAndCountDTO
     */
    async getFilterSeries(
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<SeriesFilterDTO>> {
        logger.debug(`${LOG_TAG} getFilterSeries(pagingDTO = ${pagingDTO})`);
        const result: ListAndCountDTO<SeriesDTO> = await this.seriesDao.readAll(
            pagingDTO
        );
        const seriesIdxList: number[] = result.rows.map(
            (it: SeriesDTO) => it.seriesIdx
        );
        const ingredientList: IngredientDTO[] =
            await this.ingredientDao.readBySeriesIdxList(seriesIdxList);
        const categoryList: IngredientCategoryDTO[] =
            await this.ingredientCategoryDao.readAll({
                usedCountOnPerfume: {
                    [Op.gte]: THRESHOLD_CATEGORY,
                },
            });
        const categoryMap: Dictionary<IngredientCategoryDTO> = _.chain(
            categoryList
        )
            .groupBy('id')
            .mapValues((it) => it[0])
            .value();
        const ingredientCategoryMap: {
            [key: number]: IngredientCategoryDTO[];
        } = _.chain(ingredientList)
            .groupBy('seriesIdx')
            .mapValues((arr) =>
                Array.from(
                    new Set(
                        arr
                            .map((it) => categoryMap[it.categoryIdx] ?? null)
                            .filter((it) => it != null)
                    ).values()
                )
            )
            .value();

        return result.convertType((it: SeriesDTO): SeriesFilterDTO => {
            return SeriesFilterDTO.createByJson(
                Object.assign({}, it, {
                    ingredientCategoryList:
                        ingredientCategoryMap[it.seriesIdx] || [],
                })
            );
        });
    }

    /**
     * 계열 영어 이름으로 조회
     *
     * @param {string} englishName
     * @returns {Promise<SeriesDTO>}
     **/
    findSeriesByEnglishName(englishName: string): Promise<SeriesDTO> {
        logger.debug(
            `${LOG_TAG} findSeriesByEnglishName(englishName = ${englishName})`
        );
        return this.seriesDao.findSeries({ englishName });
    }
}

export default SeriesService;
