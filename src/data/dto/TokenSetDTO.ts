class TokenSetDTO {
    readonly accessToken: string;
    readonly refreshToken: string;
    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

export { TokenSetDTO };
