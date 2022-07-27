import { Request, Response, NextFunction, RequestHandler } from 'express';

import { logger } from '@modules/winston';

import StatusCode from '@utils/statusCode';
import { ResponseDTO } from './definitions/response';
import {
    MSG_GET_SUPPORTABLE_NO,
    MSG_GET_SUPPORTABLE_YES,
} from '@src/utils/strings';

const LOG_TAG: string = '[System/Controller]';

/**
 * @swagger
 *   /system/supportable:
 *     get:
 *       tags:
 *       - system
 *       summary: apk 지원 여부 반환
 *       description: 현재 지원하는 apk의 경우 true를 반환하며, 업데이트가 필요한 경우는 false를 반환한다.
 *       operationId: getSupportable
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: apkversion
 *         in: query
 *         type: string
 *         required: true
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 현재 apk Version은 이용 가능합니다.
 *               data:
 *                 type: boolean
 *                 example: true
 *       x-swagger-router-controller: System
 * */
const getSupportable: RequestHandler = (
    req: Request,
    res: Response,
    _: NextFunction
) => {
    const apkVersion: string = req.query.apkversion?.toString() || '';
    logger.debug(`${LOG_TAG} getSupportable(apkVersion = ${apkVersion})`);
    if (isSupportVersion(apkVersion)) {
        res.status(StatusCode.OK).json(
            new ResponseDTO<Boolean>(MSG_GET_SUPPORTABLE_YES, true)
        );
        return;
    }

    res.status(StatusCode.OK).json(
        new ResponseDTO<Boolean>(MSG_GET_SUPPORTABLE_NO, false)
    );
};

class Version {
    readonly major: number;
    readonly minor: number;
    readonly patched: number;

    constructor(major: number, minor: number, patched: number) {
        this.major = major;
        this.minor = minor;
        this.patched = patched;
    }

    isEqual(other: Version) {
        return (
            this.major == other.major &&
            this.minor == other.minor &&
            this.patched == other.patched
        );
    }

    isOverThan(other: Version): Boolean {
        if (this.major != other.major) {
            return this.major > other.major;
        }
        if (this.minor != other.minor) {
            return this.minor > other.minor;
        }
        return this.patched > other.patched;
    }

    increase(): Version {
        return new Version(this.major, this.minor, this.patched + 1);
    }

    toString(): string {
        return [this.major, this.minor, this.patched].join('.');
    }

    static create(version: string) {
        const splitted: number[] = version.split('.').map((it) => parseInt(it));
        return new Version(splitted[0], splitted[1], splitted[2]);
    }
}

const prevVersion: Version = new Version(1, 4, 0);
const latestVersion: Version = new Version(1, 4, 1);

function isSupportVersion(apkVersion: string): Boolean {
    const version: Version = Version.create(apkVersion);
    if (prevVersion.isEqual(version) || latestVersion.isEqual(version)) {
        return true;
    }
    if (version.isOverThan(latestVersion)) {
        return true;
    }
    return false;
}

module.exports.getSupportable = getSupportable;
module.exports.prevVersion = prevVersion;
module.exports.latestVersion = latestVersion;
