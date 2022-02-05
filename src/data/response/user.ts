import { GenderInvMap, GenderKey } from '../../utils/enumType';

class LoginResponse {
    userIdx: number;
    nickname: string;
    gender: GenderKey;
    email: string;
    birth: number;
    token: string;
    refreshToken: string;
    constructor(
        userIdx: number,
        nickname: string,
        gender: GenderKey,
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

    static createByJson(json: any): LoginResponse {
        return new LoginResponse(
            json.userIdx,
            json.nickname,
            GenderInvMap[json.gender],
            json.email,
            json.birth,
            json.token,
            json.refreshToken
        );
    }
}

class UserAuthResponse {
    isAuth: boolean;
    isAdmin: boolean;
    constructor(isAuth: boolean, isAdmin: boolean) {
        this.isAuth = isAuth;
        this.isAdmin = isAdmin;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): UserAuthResponse {
        return new UserAuthResponse(json.isAuth, json.isAdmin);
    }
}

class UserRegisterResponse {
    userIdx: number;
    token: string;
    refreshToken: string;
    constructor(userIdx: number, token: string, refreshToken: string) {
        this.userIdx = userIdx;
        this.token = token;
        this.refreshToken = refreshToken;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): UserRegisterResponse {
        return new UserRegisterResponse(
            json.userIdx,
            json.token,
            json.refreshToken
        );
    }
}

class UserResponse {
    userIdx: number;
    nickname: string;
    gender: GenderKey;
    email: string;
    birth: number;
    constructor(
        userIdx: number,
        nickname: string,
        gender: GenderKey,
        email: string,
        birth: number
    ) {
        this.userIdx = userIdx;
        this.nickname = nickname;
        this.gender = gender;
        this.email = email;
        this.birth = birth;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): UserResponse {
        return new UserResponse(
            json.userIdx,
            json.nickname,
            GenderInvMap[json.gender],
            json.email,
            json.birth
        );
    }
}

export { LoginResponse, UserAuthResponse, UserRegisterResponse, UserResponse };
