import { AdminService } from '@src/service/AdminService';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import {
    IngredientResponse,
    LoginResponse,
    PerfumeDetailResponse,
    PerfumeResponse,
    ResponseDTO,
} from './definitions/response';
import StatusCode from '@src/utils/statusCode';
import {
    MSG_GET_ADDED_PERFUME_RECENT_SUCCESS,
    MSG_GET_PERFUME_DETAIL_SUCCESS,
    MSG_GET_SEARCH_INGREDIENT_SUCCESS,
    MSG_LOGIN_SUCCESS,
} from '@src/utils/strings';
import PerfumeService from '@src/service/PerfumeService';
import IngredientService from '@services/IngredientService';
import { PagingRequestDTO } from './definitions/request';
import {
    DEFAULT_INGREDIENT_REQUEST_SIZE,
    DEFAULT_NEW_PERFUME_REQUEST_SIZE,
} from '@src/utils/constants';
import {
    IngredientDTO,
    ListAndCountDTO,
    PagingDTO,
    PerfumeThumbDTO,
} from '@src/data/dto';

let Admin: AdminService = new AdminService();
let Perfume: PerfumeService = new PerfumeService();
let Ingredient: IngredientService = new IngredientService();

/**
 * @swagger
 *   /admin/login:
 *     post:
 *       tags:
 *       - admin
 *       description: 로그인 <br/> 반환 되는 정보 [유저 정보 + Token + refresh Token] <br/> 발행된 로그인 토큰은 헤더[x-access-token="Bearer " + Token]에 넣어주세요.
 *       operationId: loginAdminUser
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: hee.youn@samsung.com
 *             password:
 *               type: string
 *               example: test
 *       responses:
 *         200:
 *           description: success
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 로그인 성공
 *               data:
 *                 allOf:
 *                 - $ref: '#/definitions/LoginResponse'
 *         400:
 *           description: Invalid username/password supplied
 *         401:
 *           description: 비밀번호가 잘못된 경우 / 아이디가 존재하지 않는 경우
 *           schema:
 *             type: object
 *             example:
 *               message: 비밀번호가 잘못되었습니다 / 해당 조건에 일치하는 데이터가 없습니다.
 *       x-swagger-router-controller: Admin
 *  */
export const loginAdminUser: RequestHandler = async (req, res, next) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    try {
        const result = await Admin.loginAdminUser(email, password);
        const response = LoginResponse.createByJson(result);
        res.status(StatusCode.OK).json(
            new ResponseDTO<LoginResponse>(MSG_LOGIN_SUCCESS, response)
        );
    } catch (e) {
        next(e);
    }
};

/**
 * @swagger
 *  /admin/perfume/{perfumeIdx}:
 *    get:
 *      tags:
 *      - admin
 *      summary: 향수 세부 정보 조회
 *      operationId: getPerfume
 *      security:
 *      - userToken: []
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: perfumeIdx
 *        in : path
 *        required: true
 *        type: integer
 *        format: int64
 *      responses:
 *        200:
 *          description: 성공
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                exampe: 향수 세부 조회 성공
 *      x-swagger-router-controller: Admin
 */

export const getPerfume: RequestHandler = async (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const perfumeIdx: number = req.params['perfumeIdx'];
    if (isNaN(perfumeIdx)) {
        next();
        return;
    }
    try {
        const loginUserIdx: number = req.middlewareToken.loginUserIdx || -1;
        const result = await Perfume.getPerfumeById(perfumeIdx, loginUserIdx);
        const response = await PerfumeDetailResponse.createByPerfumeIntegralDTO(
            result
        );
        res.status(StatusCode.OK).json(
            new ResponseDTO<PerfumeDetailResponse>(
                MSG_GET_PERFUME_DETAIL_SUCCESS,
                response
            )
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 *  /admin/perfumes/list:
 *    get:
 *      tags:
 *      - admin
 *      summary: 향수 페이지별 리스트 조회
 *      operationId: getPerfumes
 *      security:
 *      - userToken: []
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: page
 *        in : query
 *        required: true
 *        type: integer
 *        format: int64
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 향수 검색 성공
 *               data:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: integer
 *                     example: 1
 *                   rows:
 *                     type: array
 *                     items:
 *                       allOf:
 *                       - $ref: '#/definitions/PerfumeResponse'
 *      x-swagger-router-controller: Admin
 */

export const getPerfumes: RequestHandler = async (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const page: number = req.query.page;
    if (isNaN(page)) {
        next();
        return;
    }
    const limit = 20;
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query,
        {
            requestSize: DEFAULT_NEW_PERFUME_REQUEST_SIZE,
        }
    );
    const offset = (page - 1) * limit;
    const perfumes = await Perfume.readPage(offset, limit);

    Perfume.getNewPerfume(loginUserIdx, pagingRequestDTO.toPageDTO())
        .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
            return result.convertType(PerfumeResponse.createByJson);
        })
        .then((response: ListAndCountDTO<PerfumeResponse>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponse>>(
                    MSG_GET_ADDED_PERFUME_RECENT_SUCCESS,
                    response
                )
            );
        })
        .catch((err: Error) => next(err));
};

/**
 *
 * @swagger
 *  /admin/ingredient:
 *     get:
 *       tags:
 *       - admin
 *       summary: 재료 목록 조회
 *       description: 재료 리스트 조회 <br /> 반환 되는 정보 [재료]
 *       operationId: getIngredientAll
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: requestSize
 *         in: query
 *         type: integer
 *         required: false
 *       - name: lastPosition
 *         in: query
 *         type: integer
 *         required: false
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: ingredient 목록 조회 성공
 *               data:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: integer
 *                     example: 1
 *                   rows:
 *                     type: array
 *                     items:
 *                       allOf:
 *                         - $ref: '#/definitions/IngredientResponse'
 *         401:
 *           description: Token is missing or invalid
 *       x-swagger-router-controller: Admin
 */

export const getIngredientAll: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query,
        {
            requestSize: DEFAULT_INGREDIENT_REQUEST_SIZE,
        }
    );

    const pagingDTO: PagingDTO = pagingRequestDTO.toPageDTO();
    Ingredient.getIngredientAll(pagingDTO)
        .then((result: ListAndCountDTO<IngredientDTO>) => {
            return result.convertType(IngredientResponse.createByJson);
        })
        .then((response: ListAndCountDTO<IngredientResponse>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<IngredientResponse>>(
                    MSG_GET_SEARCH_INGREDIENT_SUCCESS,
                    response
                )
            );
        })
        .catch((err: Error) => {
            next(err);
        });
};
