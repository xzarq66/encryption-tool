# 🔐 Encryption Tool

Complete encryption/decryption tool with AES-256-CBC for messages, files, and URLs.

## Features

✨ **Complete Solution:**
- 🔐 AES-256-CBC Encryption
- 📝 Text Encryption/Decryption
- 🌐 URL Support
- 📁 File Encryption/Decryption
- 💻 CLI Tool
- 🚀 REST API
- 🎨 Web UI
- 🧪 Unit Tests
- 🐳 Docker Support

## Quick Start

```bash
# Install
npm install

# Generate key
node src/cli.js generate-key

# Start API server
node src/server.js

# Open http://localhost:3000
```

## Usage Examples

### CLI
```bash
# Generate key
node src/cli.js generate-key

# Encrypt text
node src/cli.js encrypt-text "Hello" "mykey"

# Decrypt
node src/cli.js decrypt-text "iv:data" "mykey"

# Encrypt file
node src/cli.js encrypt-file file.txt mykey

# From URL
node src/cli.js encrypt-url https://example.com/text.txt mykey
```

### API
```bash
curl -X POST http://localhost:3000/api/encrypt-text \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "key": "mykey"}'
```

## Docker

```bash
docker build -t encryption-tool .
docker run -p 3000:3000 encryption-tool
```

## Testing

```bash
npm test
```

## License

MIT © 2024
