const dotenv = require('dotenv');
dotenv.config({
    path: './config/.env.test'
});

const chai = require('chai');
const { expect } = chai;
const { encrypt, decrypt } = require('../../lib/crypto.js');

describe('# encrypt and decrypt Test', () => {
    it(' # success case', async () => {
        const origin = 'test';
        const hashed = encrypt(origin);
        const result = await decrypt(hashed);
        expect(result).to.eq(origin);
    });
});