const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const { encrypt, decrypt } = require('../../src/lib/crypto.js');

describe('# encrypt and decrypt Test', () => {
    it(' # success case', () => {
        const origin = 'test';
        const hashed = encrypt(origin);
        const result = decrypt(hashed);
        expect(result).to.eq(origin);
    });
});
