const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const {
  generateKey,
  encryptText,
  decryptText,
  fetchTextFromUrl,
  encryptFile,
  decryptFile,
  keyStringToBuffer
} = require('./index');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/generate-key', (req, res) => {
  try {
    const key = generateKey();
    res.json({
      success: true,
      key: {
        hex: key.toString('hex'),
        base64: key.toString('base64'),
        length: '32 bytes (256-bit)'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/encrypt-text', (req, res) => {
  try {
    const { text, key } = req.body;
    if (!text || !key) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }
    const keyBuffer = keyStringToBuffer(key);
    const encrypted = encryptText(text, keyBuffer);
    res.json({ success: true, encrypted, textLength: text.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/decrypt-text', (req, res) => {
  try {
    const { encryptedData, key } = req.body;
    if (!encryptedData || !key) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }
    const keyBuffer = keyStringToBuffer(key);
    const decrypted = decryptText(encryptedData, keyBuffer);
    res.json({ success: true, decrypted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/encrypt-url', async (req, res) => {
  try {
    const { url, key } = req.body;
    if (!url || !key) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }
    const text = await fetchTextFromUrl(url);
    const keyBuffer = keyStringToBuffer(key);
    const encrypted = encryptText(text, keyBuffer);
    res.json({
      success: true,
      url,
      encrypted,
      textLength: text.length,
      textPreview: text.substring(0, 200) + (text.length > 200 ? '...' : '')
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/encrypt-file', upload.single('file'), (req, res) => {
  try {
    if (!req.file || !req.body.key) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }
    const filePath = req.file.path;
    const keyBuffer = keyStringToBuffer(req.body.key);
    const encrypted = encryptFile(filePath, keyBuffer);
    fs.unlinkSync(filePath);
    res.json({
      success: true,
      filename: req.file.originalname,
      size: req.file.size,
      encrypted
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/decrypt-file', (req, res) => {
  try {
    const { encryptedData, key } = req.body;
    if (!encryptedData || !key) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }
    const keyBuffer = keyStringToBuffer(key);
    const decrypted = decryptText(encryptedData, keyBuffer);
    res.json({ success: true, decrypted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'Running', version: '1.0.0' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✓ API running on http://localhost:${PORT}`);
  console.log(`✓ Web UI: http://localhost:${PORT}\n`);
});
