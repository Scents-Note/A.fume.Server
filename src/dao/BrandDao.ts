import { NotMatchedError } from '../utils/errors/errors';
import BrandDTO from '../data/dto/BrandDTO';
import PagingDTO from '../data/dto/PagingDTO';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';

const { Brand } = require('../models');

class BrandDao {
    /**
     * 브랜드 세부 조회
     *
     * @param {number} brandIdx
     * @returns {Promise<BrandDTO>}
     */
    async read(brandIdx: number) {
        const result = await Brand.findByPk(brandIdx, {
            nest: true,
            raw: true,
        });
        if (!result) {
            throw new NotMatchedError();
        }
        return BrandDTO.createByJson(result);
    }

    /**
     * 브랜드 검색
     *
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<ListAndCountDTO<BrandDTO>>}
     */
    async search(pagingDTO: PagingDTO) {
        const pagingSize: number = pagingDTO.pagingSize;
        const pagingIndex: number = pagingDTO.pagingIndex;
        const order: any = pagingDTO.order;
        return Brand.findAndCountAll({
            offset: (pagingIndex - 1) * pagingSize,
            limit: pagingSize,
            order,
            raw: true,
            nest: true,
        }).then((it: any) => {
            it.rows = it.rows.map((it: any) => BrandDTO.createByJson(it));
            return new ListAndCountDTO<BrandDTO>(it.count, it.rows);
        });
    }

    /**
     * 브랜드 전체 목록 조회
     *
     * @returns {Promise<ListAndCountDTO<BrandDTO>>}
     */
    async readAll() {
        return Brand.findAndCountAll({
            raw: true,
            nest: true,
        }).then((result: any) => {
            return new ListAndCountDTO<BrandDTO>(
                result.count,
                result.rows.map((it: any) => BrandDTO.createByJson(it))
            );
        });
    }

    /**
     * 브랜드 검색
     *
     * @param {Object} condition
     * @returns {Promise<Brand>}
     */
    async findBrand(condition: any) {
        return Brand.findOne({
            where: { ...condition },
            nest: true,
            raw: true,
        }).then((it: any) => {
            if (!it) {
                throw new NotMatchedError();
            }
            return BrandDTO.createByJson(it);
        });
    }
}

export default BrandDao;
