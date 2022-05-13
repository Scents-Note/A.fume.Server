class TokenPayloadDTO {
    readonly userIdx: number;
    readonly nickname: string;
    readonly gender: string;
    readonly email: string;
    readonly birth: number;
    constructor(
        userIdx: number,
        nickname: string,
        gender: string,
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

    static createByJson(json: any): TokenPayloadDTO {
        const userIdx: number = json.userIdx;
        const nickname: string = json.nickname;
        const gender: string = json.gender;
        const email: string = json.email;
        const birth: number = json.birth;
        return new TokenPayloadDTO(userIdx, nickname, gender, email, birth);
    }
}

export { TokenPayloadDTO };
