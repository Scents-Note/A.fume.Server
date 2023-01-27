import { logger } from '@modules/winston';

import { InvalidInputError } from '@src/utils/errors/errors';
import { GenderMap, GradeMap, GradeKey } from '@utils/enumType';
import { GRADE_USER } from '@utils/constants';
import { UserInputDTO } from '@src/data/dto';

/**
 * @swagger
 * definitions:
 *   UserEditRequest:
 *     type: object
 *     properties:
 *       password:
 *         type: string
 *       email:
 *         type: string
 *       nickname:
 *         type: string
 *       gender:
 *         type: string
 *         enum: [MAN, WOMAN]
 *       birth:
 *         type: integer
 *       grade:
 *         type: string
 *         enum: [USER, MANAGER, SYSTEM_ADMIN]
 *  */
class UserEditRequest {
    readonly userIdx?: number;
    readonly grade?: GradeKey;
    readonly gender?: string | null;
    readonly nickname?: string;
    readonly password?: string;
    readonly email?: string;
    readonly birth?: number | null;
    constructor(
        userIdx?: number,
        nickname?: string,
        password?: string,
        gender?: string | null,
        email?: string,
        birth?: number | null,
        grade?: GradeKey
    ) {
        this.userIdx = userIdx;
        this.grade = grade;
        this.gender = gender;
        this.nickname = nickname;
        this.password = password;
        this.email = email;
        this.birth = birth;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    public toUserInputDTO(): UserInputDTO {
        return createByRequest(this);
    }

    static createByJson(json: any): UserEditRequest {
        return new UserEditRequest(
            json.userIdx,
            json.nickname,
            json.password,
            json.gender,
            json.email,
            json.birth,
            json.grade
        );
    }
}

/**
 * @swagger
 * definitions:
 *   UserRegisterRequest:
 *     type: object
 *     properties:
 *       password:
 *         type: string
 *         required: true
 *         example: 1234
 *       email:
 *         type: string
 *         required: true
 *         example: heesung6701@naver.com
 *       nickname:
 *         type: string
 *         required: true
 *         example: quokkaman
 *       gender:
 *         type: string
 *         enum: [MAN, WOMAN]
 *         required: false
 *         nullable: true
 *         example: MAN
 *       birth:
 *         type: integer
 *         required: false
 *         nullable: true
 *         example: 1995
 *       grade:
 *         type: string
 *         enum: [USER, MANAGER, SYSTEM_ADMIN]
 *         example: USER
 *  */
class UserRegisterRequest {
    readonly nickname: string;
    readonly password: string;
    readonly gender: string | null;
    readonly birth: number | null;
    readonly email: string;
    readonly grade: GradeKey;
    constructor(
        nickname: string,
        password: string,
        gender: string | null,
        email: string,
        birth: number | null,
        grade: GradeKey
    ) {
        this.grade = grade;
        this.gender = gender;
        this.nickname = nickname;
        this.password = password;
        this.email = email;
        this.birth = birth;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    public toUserInputDTO(): UserInputDTO {
        return createByRequest(this);
    }

    static createByJson(json: any): UserRegisterRequest {
        return new UserRegisterRequest(
            json.nickname,
            json.password,
            json.gender || null,
            json.email,
            json.birth || null,
            json.grade | GRADE_USER
        );
    }
}

const LOG_TAG: string = '[definition/UserInputRequest]';

function createByRequest(json: any): UserInputDTO {
    let genderVal: number | null = null;
    if (json.gender) {
        if (GenderMap[json.gender] == undefined) {
            logger.debug(`${LOG_TAG} invalid gender: ${json.gender}`);
            throw new InvalidInputError();
        }
        genderVal = GenderMap[json.gender];
    }
    let gradeCode: number = GRADE_USER;
    if (json.grade) {
        if (GradeMap[json.grade] == undefined) {
            logger.debug(`${LOG_TAG} invalid grade: ${json.grade}`);
            throw new InvalidInputError();
        }
        gradeCode = GradeMap[json.grade];
    }

    return {
        userIdx: json!!.userIdx,
        nickname: json!!.nickname,
        password: json!!.password,
        gender: genderVal || null,
        email: json.email,
        birth: json.birth || null,
        grade: gradeCode,
        accessTime: undefined,
    };
}

export { UserEditRequest, UserRegisterRequest };
