import JwtController from '@libs/JwtController';
import { decrypt as _decrypt, encrypt as _encrypt } from '@libs/crypto';
import { LoginInfoDTO, TokenPayloadDTO } from '@src/data/dto';
import {
    UnAuthorizedError,
    WrongPasswordError,
} from '@src/utils/errors/errors';

// TODO: 어드민 계정용 별도 테이블 만들기
const defaultAdmin = {
    email: process.env.ADMIN_EMAIL || 'admin@email.com',
    password: _encrypt(process.env.ADMIN_PASSWORD || 'password'),
};

export class AdminService {
    crypto: any;
    jwt: any;
    constructor(crypto?: any, jwt?: any) {
        this.crypto = crypto || { encrypt: _encrypt, decrypt: _decrypt };
        this.jwt = jwt || {
            create: JwtController.create,
            publish: JwtController.publish,
            verify: JwtController.verify,
        };
    }

    async loginAdminUser(
        email: string,
        password: string
    ): Promise<LoginInfoDTO> {
        // TODO: email에 해당하는 어드민계정 테이블에서 레코드 조회
        if (email !== defaultAdmin.email) {
            throw new UnAuthorizedError();
        }
        if (
            this.crypto.decrypt(defaultAdmin.password) !==
            this.crypto.decrypt(password)
        ) {
            throw new WrongPasswordError();
        }
        const payload: any = TokenPayloadDTO.createByJson(defaultAdmin);

        const { token, refreshToken } = this.jwt.publish(payload);
        return LoginInfoDTO.createByJson(
            Object.assign({}, defaultAdmin, {
                token,
                refreshToken,
            })
        );
    }
}
