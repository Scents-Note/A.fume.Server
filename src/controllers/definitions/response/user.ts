import { GenderInvMap, GenderKey } from '@utils/enumType';

/**
 * @swagger
 * definitions:
 *   LoginResponse:
 *     type: object
 *     properties:
 *       userIdx:
 *         type: integer
 *         example: 29
 *       nickname:
 *         type: string
 *         example: nickname
 *       gender:
 *         type: string
 *         example: MAN
 *       birth:
 *         type: integer
 *         example: 1995
 *       token:
 *         type: string
 *         description: login용 userToken
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4IjoyOSwiZW1haWwiOiJoZWUueW91bkBzYW1zdW5nLmNvbSIsIm5pY2tuYW1lIjoi7L-87Lm066eoIiwiZ2VuZGVyIjoxLCJwaG9uZSI6IjAxMC0yMDgxLTM4MTgiLCJiaXJ0aCI6MTk5NSwiZ3JhZGUiOjAsImFjY2Vzc1RpbWUiOiIyMDIxLTAyLTI4VDA4OjEwOjI4LjAwMFoiLCJjcmVhdGVkQXQiOiIyMDIxLTAyLTI4VDAwOjUyOjI4LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAyLTI4VDA4OjEwOjI4LjAwMFoiLCJpYXQiOjE2MTQ0OTk5OTQsImV4cCI6MTYxNjIyNzk5NCwiaXNzIjoiYWZ1bWUtamFja3BvdCJ9.lztExrMNy-HCeaDDheos-EXRQEHMdVmQNiaYvKBPHGw
 *       refreshToken:
 *         type: string
 *         description: token 재발급 용
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZyZXNoVG9rZW4iOnsidXNlcklkeCI6MSwiZW1haWwiOiJoZWUueW91bkBzYW1zdW5nLmNvbSIsIm5pY2tuYW1lIjoi7L-87Lm066eoIiwiZ2VuZGVyIjoxLCJwaG9uZSI6IjAxMC0yMDgxLTM4MTgiLCJiaXJ0aCI6MTk5NSwiZ3JhZGUiOjAsImFjY2Vzc1RpbWUiOiIyMDIxLTAxLTA1VDEzOjAzOjQwLjAwMFoiLCJjcmVhdGVkQXQiOiIyMDIxLTAxLTA1VDEzOjAzOjQwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAxLTA1VDEzOjAzOjQwLjAwMFoifSwiaWF0IjoxNjA5ODUxODIzLCJleHAiOjE2MTE1Nzk4MjMsImlzcyI6ImFmdW1lLWphY2twb3QifQ.Vb9-KO1DWOBhuVAoBzh0USybt5b5YpZqfqG1OU3snUY
 *  */
class LoginResponse {
    readonly userIdx: number;
    readonly nickname: string;
    readonly gender: GenderKey;
    readonly email: string;
    readonly birth: number;
    readonly token: string;
    readonly refreshToken: string;
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

/**
 * @swagger
 * definitions:
 *   UserAuthResponse:
 *     type: object
 *     properties:
 *       isAuth:
 *         type: boolean
 *         description: 로그인 여부
 *         example: false
 *       isAdmin:
 *         type: boolean
 *         description: 관리자 여부
 *         example: false
 *  */
class UserAuthResponse {
    readonly isAuth: boolean;
    readonly isAdmin: boolean;
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

/**
 * @swagger
 * definitions:
 *   UserRegisterResponse:
 *     type: object
 *     properties:
 *       userIdx:
 *         type: number
 *       token:
 *         type: string
 *       refreshToken:
 *         type: string
 *     example:
 *       userIdx: 1
 *       token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4IjoyOSwiZW1haWwiOiJoZWUueW91bkBzYW1zdW5nLmNvbSIsIm5pY2tuYW1lIjoi7L-87Lm066eoIiwiZ2VuZGVyIjoxLCJwaG9uZSI6IjAxMC0yMDgxLTM4MTgiLCJiaXJ0aCI6MTk5NSwiZ3JhZGUiOjAsImFjY2Vzc1RpbWUiOiIyMDIxLTAyLTI4VDA4OjEwOjI4LjAwMFoiLCJjcmVhdGVkQXQiOiIyMDIxLTAyLTI4VDAwOjUyOjI4LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAyLTI4VDA4OjEwOjI4LjAwMFoiLCJpYXQiOjE2MTQ0OTk5OTQsImV4cCI6MTYxNjIyNzk5NCwiaXNzIjoiYWZ1bWUtamFja3BvdCJ9.lztExrMNy-HCeaDDheos-EXRQEHMdVmQNiaYvKBPHGw
 *       refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZyZXNoVG9rZW4iOnsidXNlcklkeCI6MSwiZW1haWwiOiJoZWUueW91bkBzYW1zdW5nLmNvbSIsIm5pY2tuYW1lIjoi7L-87Lm066eoIiwiZ2VuZGVyIjoxLCJwaG9uZSI6IjAxMC0yMDgxLTM4MTgiLCJiaXJ0aCI6MTk5NSwiZ3JhZGUiOjAsImFjY2Vzc1RpbWUiOiIyMDIxLTAxLTA1VDEzOjAzOjQwLjAwMFoiLCJjcmVhdGVkQXQiOiIyMDIxLTAxLTA1VDEzOjAzOjQwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAxLTA1VDEzOjAzOjQwLjAwMFoifSwiaWF0IjoxNjA5ODUxODIzLCJleHAiOjE2MTE1Nzk4MjMsImlzcyI6ImFmdW1lLWphY2twb3QifQ.Vb9-KO1DWOBhuVAoBzh0USybt5b5YpZqfqG1OU3snUY
 *  */
class UserRegisterResponse {
    readonly userIdx: number;
    readonly token: string;
    readonly refreshToken: string;
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

/**
 * @swagger
 * definitions:
 *   UserResponse:
 *     type: object
 *     properties:
 *       userIdx:
 *         type: number
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
 *     example:
 *       userIdx: 1
 *       email: hee.youn@samsung.com
 *       nickname: 쿼카맨
 *       gender: MAN
 *       birth: 1995
 *  */
class UserResponse {
    readonly userIdx: number;
    readonly nickname: string;
    readonly gender: GenderKey;
    readonly email: string;
    readonly birth: number;
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
