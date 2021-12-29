import BrandFilterDTO from '../data/dto/BrandFilterDTO';
import BrandDao from '../dao/BrandDao';
import { PagingRequestDTO } from '../data/request/common';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';
import BrandDTO from '../data/dto/BrandDTO';
import PagingDTO from '../data/dto/PagingDTO';

class BrandService {
    brandDao: BrandDao;
    constructor(brandDao?: BrandDao) {
        this.brandDao = brandDao || new BrandDao();
    }
    /**
     * 브랜드 검색
     *
     * @param {PagingRequestDTO} pagingRequestDTO
     * @returns {Promise<ListAndCountDTO<BrandDTO>>} listAndCountDTO
     **/
    searchBrand(
        pagingRequestDTO: PagingRequestDTO
    ): Promise<ListAndCountDTO<BrandDTO>> {
        const pagingDTO = PagingDTO.create(pagingRequestDTO);
        return this.brandDao.search(pagingDTO);
    }
    /**
     * 브랜드 전체 조회
     *
     * @returns {Promise<ListAndCountDTO<BrandDTO>>} listAndCountDTO
     **/
    getBrandAll(): Promise<ListAndCountDTO<BrandDTO>> {
        return this.brandDao.readAll();
    }

    /**
     * 브랜드 조회
     *
     * @param {number} brandIdx
     * @returns {Promise<BrandDTO>} brandDTO
     **/
    getBrandByIdx(brandIdx: number): Promise<BrandDTO> {
        return this.brandDao.read(brandIdx);
    }

    /**
     * 브랜드 필터 조회
     *
     * @returns {Promise<BrandFilterDTO[]>} brandFilterDTO[]
     */
    getFilterBrand(): Promise<BrandFilterDTO[]> {
        return this.brandDao.readAll().then((result) => {
            const firstInitialMap = result.rows.reduce(
                (prev: Map<string, BrandDTO[]>, cur: BrandDTO) => {
                    if (!prev.has(cur.firstInitial)) {
                        prev.set(cur.firstInitial, []);
                    }
                    prev.get(cur.firstInitial)!!.push(cur);
                    return prev;
                },
                new Map<string, BrandDTO[]>()
            );
            return Array.from(firstInitialMap.keys()).map((key: string) => {
                return new BrandFilterDTO(key, firstInitialMap.get(key) || []);
            });
        });
    }
}

export default BrandService;
