#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const {
  generateKey,
  encryptText,
  decryptText,
  fetchTextFromUrl,
  encryptFile,
  decryptFile,
  keyStringToBuffer
} = require('./index');

program
  .name('encrypt-tool')
  .description('CLI tool for encrypting and decrypting messages and files')
  .version('1.0.0');

program
  .command('generate-key')
  .description('Generate a random encryption key')
  .option('-f, --format <format>', 'Output format: hex or base64', 'hex')
  .action((options) => {
    try {
      const key = generateKey();
      const hexKey = key.toString('hex');
      const base64Key = key.toString('base64');

      console.log(chalk.blue.bold('\n✓ Generated Encryption Key\n'));
      console.log(chalk.yellow('Hex format:'));
      console.log(chalk.green(hexKey));
      console.log(chalk.yellow('\nBase64 format:'));
      console.log(chalk.green(base64Key));
      console.log(chalk.yellow('\nLength:'), '32 bytes (256-bit)');
      console.log('\n');
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('encrypt-text <text> <key>')
  .description('Encrypt plain text')
  .action((text, key) => {
    try {
      const keyBuffer = keyStringToBuffer(key);
      const encrypted = encryptText(text, keyBuffer);

      console.log(chalk.blue.bold('\n✓ Text Encrypted\n'));
      console.log(chalk.yellow('Plain text:'));
      console.log(chalk.white(text));
      console.log(chalk.yellow('\nEncrypted:'));
      console.log(chalk.green(encrypted));
      console.log('\n');
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('decrypt-text <encryptedData> <key>')
  .description('Decrypt encrypted text')
  .action((encryptedData, key) => {
    try {
      const keyBuffer = keyStringToBuffer(key);
      const decrypted = decryptText(encryptedData, keyBuffer);

      console.log(chalk.blue.bold('\n✓ Text Decrypted\n'));
      console.log(chalk.yellow('Encrypted:'));
      console.log(chalk.white(encryptedData));
      console.log(chalk.yellow('\nDecrypted:'));
      console.log(chalk.green(decrypted));
      console.log('\n');
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('encrypt-url <url> <key>')
  .description('Fetch text from URL and encrypt it')
  .action(async (url, key) => {
    try {
      console.log(chalk.blue('Fetching from URL...'));
      const text = await fetchTextFromUrl(url);
      const keyBuffer = keyStringToBuffer(key);
      const encrypted = encryptText(text, keyBuffer);

      console.log(chalk.blue.bold('\n✓ URL Content Encrypted\n'));
      console.log(chalk.yellow('URL:'));
      console.log(chalk.white(url));
      console.log(chalk.yellow('\nFetched text (first 100 chars):'));
      console.log(chalk.white(text.substring(0, 100) + (text.length > 100 ? '...' : '')));
      console.log(chalk.yellow('\nEncrypted:'));
      console.log(chalk.green(encrypted));
      console.log('\n');
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('encrypt-file <filePath> <key>')
  .description('Encrypt a file')
  .option('-o, --output <output>', 'Output file path')
  .action((filePath, key, options) => {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const keyBuffer = keyStringToBuffer(key);
      const encrypted = encryptFile(filePath, keyBuffer);
      const outputPath = options.output || filePath + '.enc';
      fs.writeFileSync(outputPath, encrypted, 'utf8');

      console.log(chalk.blue.bold('\n✓ File Encrypted\n'));
      console.log(chalk.yellow('Source file:'));
      console.log(chalk.white(filePath));
      console.log(chalk.yellow('\nOutput file:'));
      console.log(chalk.green(outputPath));
      console.log('\n');
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('decrypt-file <encryptedFile> <key>')
  .description('Decrypt a file')
  .option('-o, --output <output>', 'Output file path')
  .action((encryptedFile, key, options) => {
    try {
      if (!fs.existsSync(encryptedFile)) {
        throw new Error(`File not found: ${encryptedFile}`);
      }

      const keyBuffer = keyStringToBuffer(key);
      const encryptedData = fs.readFileSync(encryptedFile, 'utf8');
      const outputPath = options.output || encryptedFile.replace('.enc', '.dec');

      decryptFile(encryptedData, outputPath, keyBuffer);

      console.log(chalk.blue.bold('\n✓ File Decrypted\n'));
      console.log(chalk.yellow('Encrypted file:'));
      console.log(chalk.white(encryptedFile));
      console.log(chalk.yellow('\nOutput file:'));
      console.log(chalk.green(outputPath));
      console.log('\n');
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
