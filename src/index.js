const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Generate a random encryption key (32 bytes for AES-256)
 */
function generateKey() {
  return crypto.randomBytes(32);
}

/**
 * Encrypt text with a given key using AES-256-CBC
 */
function encryptText(text, key) {
  if (!Buffer.isBuffer(key) || key.length !== 32) {
    throw new Error('Key must be a 32-byte buffer');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt text with a given key
 */
function decryptText(encryptedData, key) {
  if (!Buffer.isBuffer(key) || key.length !== 32) {
    throw new Error('Key must be a 32-byte buffer');
  }

  const parts = encryptedData.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format. Expected: iv:encrypteddata');
  }

  const [ivHex, encrypted] = parts;
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Fetch text from URL
 */
async function fetchTextFromUrl(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch URL: ${error.message}`);
  }
}

/**
 * Encrypt file
 */
function encryptFile(filePath, key) {
  if (!Buffer.isBuffer(key) || key.length !== 32) {
    throw new Error('Key must be a 32-byte buffer');
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  return encryptText(fileContent, key);
}

/**
 * Decrypt file
 */
function decryptFile(encryptedData, outputPath, key) {
  if (!Buffer.isBuffer(key) || key.length !== 32) {
    throw new Error('Key must be a 32-byte buffer');
  }

  const decrypted = decryptText(encryptedData, key);
  fs.writeFileSync(outputPath, decrypted, 'utf8');
  return outputPath;
}

/**
 * Convert key string to buffer (accepts hex or base64)
 */
function keyStringToBuffer(keyString) {
  if (keyString.length === 64) {
    return Buffer.from(keyString, 'hex');
  } else if (keyString.length === 44) {
    return Buffer.from(keyString, 'base64');
  } else {
    return crypto.createHash('sha256').update(keyString).digest();
  }
}

module.exports = {
  generateKey,
  encryptText,
  decryptText,
  fetchTextFromUrl,
  encryptFile,
  decryptFile,
  keyStringToBuffer
};
