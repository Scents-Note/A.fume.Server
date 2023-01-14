import MonitoringService from '@src/service/MonitoringService';
import express from 'express';

/**
 * @swagger
 * securityDefinitions:
 *   userToken:
 *       type: apiKey
 *       name: x-access-token
 *       in: header
 *       description: /Bearer {token}/ 를 입력해주시면 됩니다.
 * */

/**
 * http 요청 횟수 모니터링
 *
 * @param {*} req
 * @param {*} authOrSecDef
 * @param {*} token
 * @param {*} callback
 */
function updateMonitoringToken(
    req: express.Request | any,
    _res: express.Response,
    next: express.NextFunction
) {
    const token = MonitoringService.getToken();
    token.numberOfHttpRequest += 1;
    if (req.middlewareToken.loginUserIdx != -1) {
        token.visitors.add(req.middlewareToken.loginUserIdx);
    }
    return next(null);
}

export { updateMonitoringToken };
