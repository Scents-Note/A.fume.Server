import { expect } from 'chai';
import UserDTO from '../../src/data/dto/UserDTO';

const {
    GENDER_MAN,
    GENDER_WOMAN,
    GRADE_MANAGER,
    GRADE_USER,
    GRADE_SYSTEM_ADMIN,
} = require('../../src/utils/constantUtil');

class UserMockHelper {
    static validTest(this: UserDTO) {
        expect(this.userIdx).to.be.gt(0);
        expect(this.nickname).to.be.ok;
        expect(this.email).to.be.ok;
        expect(this.password).to.be.ok;
        expect(this.gender).to.be.oneOf([GENDER_MAN, GENDER_WOMAN]);
        expect(this.birth).to.be.ok;
        expect(this.grade).to.be.oneOf([
            GRADE_USER,
            GRADE_MANAGER,
            GRADE_SYSTEM_ADMIN,
        ]);
        expect(this.createdAt).to.be.ok;
        expect(this.updatedAt).to.be.ok;
    }

    static createMock(condition: any): UserDTO {
        return UserDTO.createByJson(
            Object.assign(
                {
                    userIdx: 1,
                    nickname: 'user1',
                    password: 'test',
                    gender: GENDER_WOMAN,
                    email: 'email1@afume.com',
                    birth: 1995,
                    grade: GRADE_MANAGER,
                    accessTime: '2021-07-13T11:33:49.000Z',
                    createdAt: '2021-07-13T11:33:49.000Z',
                    updatedAt: '2021-08-07T09:20:29.000Z',
                },
                condition
            )
        );
    }
}

export default UserMockHelper;
