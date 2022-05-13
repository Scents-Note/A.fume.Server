import { GRADE_USER } from '@utils/constants';
import { GradeKey, GenderKey } from '@utils/enumType';

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

export { UserInputRequest, UserEditRequest, UserRegisterRequest };
