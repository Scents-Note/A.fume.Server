import { Gender } from '@utils/enumType';

class LoginInfoDTO {
    userIdx: number;
    nickname: string;
    gender: Gender;
    email: string;
    birth: number;
    token: string;
    refreshToken: string;
    constructor(
        userIdx: number,
        nickname: string,
        gender: Gender,
        email: string,
        birth: number,
        token: string,
        refreshToken: string
    ) {
        this.userIdx = userIdx;
        this.nickname = nickname;
        this.gender = gender;
        this.email = email;
        this.birth = birth;
        this.token = token;
        this.refreshToken = refreshToken;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): LoginInfoDTO {
        return new LoginInfoDTO(
            json.userIdx,
            json.nickname,
            json.gender,
            json.email,
            json.birth,
            json.token,
            json.refreshToken
        );
    }
}

export { LoginInfoDTO };
