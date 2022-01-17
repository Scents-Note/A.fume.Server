import dotenv from 'dotenv';
dotenv.config();
import { encrypt, decrypt } from '../../src/lib/crypto';

import { expect } from 'chai';

describe('# encrypt and decrypt Test', () => {
    it(' # success case', () => {
        const origin: string = 'test';
        const hashed: string = encrypt(origin);
        const result: string = decrypt(hashed);
        expect(result).to.eq(origin);
    });
});
