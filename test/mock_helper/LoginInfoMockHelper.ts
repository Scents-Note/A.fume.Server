import { expect } from 'chai';

import { GENDER_WOMAN, GENDER_MAN } from '@utils/constants';

import { LoginInfoDTO } from '@dto/index';

class LoginInfoMockHelper {
    static validTest(this: LoginInfoDTO) {
        expect(this.userIdx).to.be.ok;
        expect(this.nickname).to.be.ok;
        expect(this.gender).to.be.oneOf([GENDER_WOMAN, GENDER_MAN]);
        expect(this.birth).to.be.gte(1900);
        expect(this.email).to.be.ok;
        expect(this.token).to.be.ok;
        expect(this.refreshToken).to.be.ok;
    }

    static createMock(condition: any): LoginInfoDTO {
        return LoginInfoDTO.createByJson(
            Object.assign(
                {
                    userIdx: 1,
                    nickname: 'user1',
                    gender: GENDER_WOMAN,
                    email: 'email@a.fume.com',
                    birth: 1995,
                    token: 'token',
                    refreshToken: 'refreshToken',
                },
                condition
            )
        );
    }
}

export default LoginInfoMockHelper;
