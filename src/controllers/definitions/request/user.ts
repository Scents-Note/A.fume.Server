import { logger } from '@modules/winston';

import { InvalidInputError } from '@src/utils/errors/errors';
import { GenderMap, GradeMap, GradeKey, GenderKey } from '@utils/enumType';
import { GRADE_USER } from '@utils/constants';
import { UserInputDTO } from '@src/data/dto';

interface UserInputRequest {
    grade?: GradeKey;
    gender?: GenderKey;
    nickname?: string;
    password?: string;
    email?: string;
    birth?: number;
}

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
class UserEditRequest implements UserInputRequest {
    grade?: GradeKey;
    gender?: GenderKey;
    nickname?: string;
    password?: string;
    email?: string;
    birth?: number;
    constructor(
        nickname?: string,
        password?: string,
        gender?: GenderKey,
        email?: string,
        birth?: number,
        grade?: GradeKey
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

    public toUserInputDTO(userIdx: number): UserInputDTO {
        return createByRequest(userIdx, this);
    }

    static createByJson(json: any): UserEditRequest {
        return new UserEditRequest(
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
 *       email:
 *         type: string
 *         required: true
 *       nickname:
 *         type: string
 *         required: true
 *       gender:
 *         type: string
 *         enum: [MAN, WOMAN]
 *         required: true
 *       birth:
 *         type: integer
 *         required: true
 *       grade:
 *         type: string
 *         enum: [USER, MANAGER, SYSTEM_ADMIN]
 *         required: true
 *  */
class UserRegisterRequest implements UserInputRequest {
    nickname: string;
    password: string;
    gender: GenderKey;
    birth: number;
    email: string;
    grade: GradeKey;
    constructor(
        nickname: string,
        password: string,
        gender: GenderKey,
        email: string,
        birth: number,
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
        return createByRequest(undefined, this);
    }

    static createByJson(json: any): UserRegisterRequest {
        return new UserRegisterRequest(
            json.nickname,
            json.password,
            json.gender,
            json.email,
            json.birth,
            json.grade | GRADE_USER
        );
    }
}

const LOG_TAG: string = '[definition/UserInputRequest]';

function createByRequest(
    userIdx: number | undefined,
    request: UserInputRequest
): UserInputDTO {
    let genderCode: any = undefined;
    if (request.gender) {
        if (GenderMap[request.gender] == undefined) {
            logger.debug(`${LOG_TAG} invalid gender: ${request.gender}`);
            throw new InvalidInputError();
        }
        genderCode = GenderMap[request.gender];
    }
    let gradeCode: number = GRADE_USER;
    if (request.grade) {
        if (GradeMap[request.grade] == undefined) {
            logger.debug(`${LOG_TAG} invalid grade: ${request.grade}`);
            throw new InvalidInputError();
        }
        gradeCode = GradeMap[request.grade];
    }

    return new UserInputDTO(
        userIdx,
        request.nickname,
        request.password,
        genderCode,
        request.email,
        request.birth,
        gradeCode,
        undefined
    );
}

export { UserInputRequest, UserEditRequest, UserRegisterRequest };
