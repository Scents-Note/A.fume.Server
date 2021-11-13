import BrandService from '../service/BrandService';
import BrandResponseDTO from '../data/response_dto/brand/BrandResponseDTO';
import BrandFilterResponseDTO from '../data/response_dto/brand/BrandFilterResponseDTO';
import ResponseDTO from '../data/response_dto/common/ResponseDTO';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';

let Brand: BrandService = new BrandService();

module.exports.setBrandService = (brandService: BrandService) => {
    Brand = brandService;
};

const { OK } = require('../utils/statusCode.js');

module.exports.getBrandAll = (_: any, res: any, next: any) => {
    Brand.getBrandAll()
        .then((result: any) => {
            /* TODO: Change BrandResponseDTO to interface */
            return new ListAndCountDTO<BrandResponseDTO>(
                result.count,
                result.rows.map(
                    (it: any) => new BrandResponseDTO(it.brandIdx, it.name)
                )
            );
        })
        .then((result: ListAndCountDTO<BrandResponseDTO>) => {
            res.status(OK).json(
                new ResponseDTO<ListAndCountDTO<BrandResponseDTO>>(
                    '브랜드 조회 성공',
                    result
                )
            );
        })
        .catch((err: any) => next(err));
};

module.exports.getFilterBrand = (_: any, res: any, next: any) => {
    Brand.getFilterBrand()
        .then((result: any) => {
            return result.map((it: any) => BrandFilterResponseDTO.create(it));
        })
        .then((response: any) => {
            res.status(OK).json(
                new ResponseDTO('브랜드 필터 조회 성공', response)
            );
        })
        .catch((err: any) => next(err));
};
