import BrandService from '../service/BrandService';
import BrandResponseDTO from '../data/response_dto/brand/BrandResponseDTO';
import BrandFilterResponseDTO from '../data/response_dto/brand/BrandFilterResponseDTO';

let Brand: BrandService = new BrandService();

module.exports.setBrandService = (brandService: BrandService) => {
    Brand = brandService;
};

const { OK } = require('../utils/statusCode.js');

const {
    ResponseDTO,
    ListAndCountResponseDTO,
} = require('../data/response_dto/common');

module.exports.getBrandAll = (_: any, res: any, next: any) => {
    Brand.getBrandAll()
        .then((result: any) => {
            return {
                count: result.count,
                rows: result.rows.map(
                    (it: any) => new BrandResponseDTO(it.brandIdx, it.name)
                ),
            };
        })
        .then((result: any) => {
            const count: number = result.count;
            const rows: BrandResponseDTO[] = result.rows;
            res.status(OK).json(
                new ListAndCountResponseDTO({
                    message: '브랜드 조회 성공',
                    count,
                    rows,
                })
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
                new ResponseDTO({
                    message: '브랜드 필터 조회 성공',
                    data: response,
                })
            );
        })
        .catch((err: any) => next(err));
};
