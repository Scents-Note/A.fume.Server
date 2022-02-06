import dotenv from 'dotenv';
dotenv.config();

import { expect } from 'chai';

import { encrypt, decrypt } from '@libs/crypto';

describe('# encrypt and decrypt Test', () => {
    it(' # success case', () => {
        const origin: string = 'test';
        const hashed: string = encrypt(origin);
        const result: string = decrypt(hashed);
        expect(result).to.eq(origin);
    });
});
