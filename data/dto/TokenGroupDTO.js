'use strict';

class TokenGroupDTO {
    constructor({ userIdx, token, refreshToken }) {
        this.userIdx = userIdx;
        this.token = token;
        this.refreshToken = refreshToken;
    }
}

module.exports = TokenGroupDTO;
