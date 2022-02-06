import { GradeKey, GenderKey } from '@utils/enumType';
import { GRADE_USER } from '@utils/constants';

class UserEditRequest {
    userIdx: number;
    grade?: GradeKey;
    gender?: GenderKey;
    nickname?: string;
    password?: string;
    email?: string;
    birth?: number;
    constructor(
        userIdx: number,
        nickname?: string,
        password?: string,
        gender?: GenderKey,
        email?: string,
        birth?: number,
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
class UserRegisterRequest {
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

export { UserEditRequest, UserRegisterRequest };
