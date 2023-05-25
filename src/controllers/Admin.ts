import { AdminService } from '@src/service/AdminService';
import { RequestHandler } from 'express';
import { LoginResponse, ResponseDTO } from './definitions/response';
import StatusCode from '@src/utils/statusCode';
import { MSG_LOGIN_SUCCESS } from '@src/utils/strings';

let Admin: AdminService = new AdminService();

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
