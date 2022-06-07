import { Gender, Grade } from '@utils/enumType';

class UserDTO {
    userIdx: number;
    nickname: string;
    password: string;
    gender: Gender;
    email: string;
    birth: number;
    grade: Grade;
    accessTime: string;
    createdAt: string;
    updatedAt: string;
    constructor(
        userIdx: number,
        nickname: string,
        password: string,
        gender: Gender,
        email: string,
        birth: number,
        grade: Grade,
        accessTime: string,
        createdAt: string,
        updatedAt: string
    ) {
        this.userIdx = userIdx;
        this.nickname = nickname;
        this.password = password;
        this.gender = gender;
        this.email = email;
        this.birth = birth;
        this.grade = grade;
        this.accessTime = accessTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): UserDTO {
        return new UserDTO(
            json.userIdx,
            json.nickname,
            json.password,
            json.gender,
            json.email,
            json.birth,
            json.grade,
            json.accessTime,
            json.createdAt,
            json.updatedAt
        );
    }
}

export { UserDTO };
