import { expect } from 'chai';
import TokenGroupDTO from '../../../src/data/dto/TokenGroupDTO';

class TokenGroupMockHelper {
    static validTest(this: TokenGroupDTO) {
        expect(this.userIdx).to.be.ok;
        expect(this.token).to.be.ok;
        expect(this.refreshToken).to.be.ok;
    }

    static createMock(condition: any): TokenGroupDTO {
        return TokenGroupDTO.createByJSON(
            Object.assign(
                {
                    userIdx: 1,
                    token: 'token',
                    refreshToken: 'refreshToken',
                },
                condition
            )
        );
    }
}

export default TokenGroupMockHelper;
