class TokenGroupDTO {
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

    static createByJSON(json: any): TokenGroupDTO {
        return new TokenGroupDTO(json.userIdx, json.token, json.refreshToken);
    }
}

export { TokenGroupDTO };
