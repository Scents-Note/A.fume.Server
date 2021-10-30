const crypto = require('crypto');

const algorithm = 'aes-256-cbc';

const ENCRYPTION_KEY =
    process.env.ENCRYPTION_KEY || 'abcdefghijklmnop'.repeat(2);
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * 암호화
 *
 * @param {string} text - 암호 평문
 * @returns {string}
 */
module.exports.encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(ENCRYPTION_KEY),
        iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * 복호화
 *
 * @param {string} text - 암호
 * @returns {string}
 */
module.exports.decrypt = (text) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(ENCRYPTION_KEY),
        iv
    );
    const decrypted = decipher.update(encryptedText);
    return Buffer.concat([decrypted, decipher.final()]).toString();
};
