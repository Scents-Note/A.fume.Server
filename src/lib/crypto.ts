import crypto from 'crypto';

const algorithm: string = 'aes-256-cbc';

const ENCRYPTION_KEY: string =
    process.env.ENCRYPTION_KEY || 'abcdefghijklmnop'.repeat(2);
const IV_LENGTH: number = 16; // For AES, this is always 16

/**
 * 암호화
 *
 * @param {string} text - 암호 평문
 * @returns {string}
 */
function encrypt(text: string) {
    const iv: Buffer = crypto.randomBytes(IV_LENGTH);
    const cipher: crypto.Cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(ENCRYPTION_KEY),
        iv
    );
    const encrypted: Buffer = cipher.update(text);
    return (
        iv.toString('hex') +
        ':' +
        Buffer.concat([encrypted, cipher.final()]).toString('hex')
    );
}

/**
 * 복호화
 *
 * @param {string} text - 암호
 * @returns {string}
 */
function decrypt(text: string) {
    const textParts: any[] = text.split(':');
    const iv: Buffer = Buffer.from(textParts.shift(), 'hex');
    const encryptedText: Buffer = Buffer.from(textParts.join(':'), 'hex');
    const decipher: crypto.Decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(ENCRYPTION_KEY),
        iv
    );
    const decrypted: Buffer = decipher.update(encryptedText);
    return Buffer.concat([decrypted, decipher.final()]).toString();
}

export { encrypt, decrypt };
