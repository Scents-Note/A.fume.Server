import { NotMatchedError } from '../utils/errors/errors';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';
import SeriesDTO from '../data/dto/SeriesDTO';
import PagingDTO from '../data/dto/PagingDTO';

import { logger } from '../modules/winston';

const LOG_TAG: string = '[Series/DAO]';

const { Series } = require('../models');

class SeriesDao {
    /**
     * 계열 조회
     *
     * @param {number} seriesIdx
     * @return {Promise<SeriesDTO>} seriesDTO
     */
    async readByIdx(seriesIdx: number): Promise<SeriesDTO> {
        logger.debug(`${LOG_TAG} readByIdx(seriesIdx = ${seriesIdx})`);
        const result = await Series.findByPk(seriesIdx);
        if (!result) {
            throw new NotMatchedError();
        }
        return SeriesDTO.createByJson(result.dataValues);
    }

    /**
     * 계열 조회
     *
     * @param {string} seriesName
     * @return {Promise<SeriesDTO>} seriesDTO
     */
    async readByName(seriesName: string): Promise<SeriesDTO> {
        logger.debug(`${LOG_TAG} readByName(seriesIdx = ${seriesName})`);
        const result = await Series.findOne({
            where: { name: seriesName },
            nest: true,
            raw: true,
        });
        if (!result) {
            throw new NotMatchedError();
        }
        return SeriesDTO.createByJson(result);
    }

    /**
     * 계열 전체 조회
     *
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<ListAndCount<SeriesDTO>>} listAndCount
     */
    async readAll(pagingDTO: PagingDTO): Promise<ListAndCountDTO<SeriesDTO>> {
        logger.debug(`${LOG_TAG} readAll(pagingDTO = ${pagingDTO})`);
        return Series.findAndCountAll({
            offset: (pagingDTO.pagingIndex - 1) * pagingDTO.pagingSize,
            limit: pagingDTO.pagingSize,
            order: pagingDTO.order,
            raw: true,
            nest: true,
        }).then((it: any) => {
            return new ListAndCountDTO<SeriesDTO>(
                it.count,
                it.rows.map(SeriesDTO.createByJson)
            );
        });
    }

    /**
     * 계열 검색
     *
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<ListAndCountDTO<SeriesDTO>>} listAndCountDTO
     */
    async search(pagingDTO: PagingDTO): Promise<ListAndCountDTO<SeriesDTO>> {
        logger.debug(`${LOG_TAG} search(pagingDTO = ${pagingDTO})`);
        return Series.findAndCountAll({
            offset: (pagingDTO.pagingIndex - 1) * pagingDTO.pagingSize,
            limit: pagingDTO.pagingSize,
            order: pagingDTO.order,
            raw: true,
            nest: true,
        }).then((it: any) => {
            return new ListAndCountDTO<SeriesDTO>(
                it.count,
                it.rows.map(SeriesDTO.createByJson)
            );
        });
    }

    /**
     * 계열 검색
     *
     * @param {Object} condition
     * @returns {Promise<SeriesDTO>} seriesDTO
     */
    async findSeries(condition: any): Promise<SeriesDTO> {
        logger.debug(
            `${LOG_TAG} findSeries(condition = ${JSON.stringify(condition)})`
        );
        return Series.findOne({ where: condition, nest: true, raw: true }).then(
            (it: any) => {
                if (!it) {
                    throw new NotMatchedError();
                }
                return SeriesDTO.createByJson(it);
            }
        );
    }
}

export default SeriesDao;
