import { logger } from '@modules/winston';

import { ListAndCountDTO, SeriesDTO, PagingDTO } from '@dto/index';

const LOG_TAG: string = '[Series/DAO]';

const { Series } = require('@sequelize');

class SeriesDao {
    /**
     * 계열 전체 조회
     *
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<ListAndCount<SeriesDTO>>} listAndCount
     */
    async readAll(
        pagingDTO: PagingDTO,
        where: any = {}
    ): Promise<ListAndCountDTO<SeriesDTO>> {
        logger.debug(`${LOG_TAG} readAll(pagingDTO = ${pagingDTO})`);
        return Series.findAndCountAll(
            Object.assign(
                {
                    where,
                    raw: true,
                    nest: true,
                },
                pagingDTO.sequelizeOption()
            )
        ).then((it: any) => {
            return new ListAndCountDTO<SeriesDTO>(
                it.count,
                it.rows.map(SeriesDTO.createByJson)
            );
        });
    }
}

export default SeriesDao;
