const {
  generateKey,
  encryptText,
  decryptText,
  keyStringToBuffer
} = require('../src/index');

describe('Encryption Tests', () => {
  let key;

  beforeEach(() => {
    key = generateKey();
  });

  test('generateKey returns 32-byte buffer', () => {
    const testKey = generateKey();
    expect(Buffer.isBuffer(testKey)).toBe(true);
    expect(testKey.length).toBe(32);
  });

  test('encryptText encrypts successfully', () => {
    const plainText = 'Hello, World!';
    const encrypted = encryptText(plainText, key);
    expect(typeof encrypted).toBe('string');
    expect(encrypted).toContain(':');
  });

  test('decryptText decrypts correctly', () => {
    const plainText = 'Hello, World!';
    const encrypted = encryptText(plainText, key);
    const decrypted = decryptText(encrypted, key);
    expect(decrypted).toBe(plainText);
  });

  test('decryptText throws error with wrong key', () => {
    const plainText = 'Secret';
    const encrypted = encryptText(plainText, key);
    const wrongKey = generateKey();
    expect(() => decryptText(encrypted, wrongKey)).toThrow();
  });

  test('each encryption produces different output', () => {
    const plainText = 'Same';
    const encrypted1 = encryptText(plainText, key);
    const encrypted2 = encryptText(plainText, key);
    expect(encrypted1).not.toBe(encrypted2);
  });

  test('keyStringToBuffer handles hex', () => {
    const hexKey = key.toString('hex');
    const buffer = keyStringToBuffer(hexKey);
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBe(32);
  });

  test('keyStringToBuffer handles base64', () => {
    const base64Key = key.toString('base64');
    const buffer = keyStringToBuffer(base64Key);
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBe(32);
  });

  test('handles unicode characters', () => {
    const plainText = '你好世界';
    const encrypted = encryptText(plainText, key);
    const decrypted = decryptText(encrypted, key);
    expect(decrypted).toBe(plainText);
  });
});
