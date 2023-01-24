import { Gender, Grade } from '@utils/enumType';

class UserInputDTO {
    readonly userIdx?: number;
    readonly nickname?: string;
    readonly password?: string;
    readonly gender?: Gender;
    readonly email?: string;
    readonly birth?: number;
    readonly grade?: Grade;
    readonly accessTime?: string;
    constructor(
        userIdx?: number,
        nickname?: string,
        password?: string,
        gender?: Gender,
        email?: string,
        birth?: number,
        grade?: Grade,
        accessTime?: string
    ) {
        this.userIdx = userIdx;
        this.nickname = nickname;
        this.password = password;
        this.gender = gender;
        this.email = email;
        this.birth = birth;
        this.grade = grade;
        this.accessTime = accessTime;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): UserInputDTO {
        return new UserInputDTO(
            json.userIdx,
            json.nickname,
            json.password,
            json.gender,
            json.email,
            json.birth,
            json.grade,
            json.accessTime
        );
    }
}

export { UserInputDTO };
