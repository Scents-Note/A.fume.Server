class TokenGroupDTO {
    userIdx: number;
    token: string;
    refreshToken: string;
    constructor(userIdx: number, token: string, refreshToken: string) {
        this.userIdx = userIdx;
        this.token = token;
        this.refreshToken = refreshToken;
    }
    static createByJSON(json: any): TokenGroupDTO {
        return new TokenGroupDTO(json.userIdx, json.token, json.refreshToken);
    }
}

export default TokenGroupDTO;
