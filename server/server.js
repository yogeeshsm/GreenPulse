require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Multer config for image uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 4.5 * 1024 * 1024 } // 4.5MB limit for Vercel Serverless
});

// ... imports ...

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ...

app.post('/api/analyze', upload.single('image'), async (req, res) => {
    try {
        let base64Image, mimeType;

        if (req.file) {
            // File upload via multipart (Memory Storage)
            base64Image = req.file.buffer.toString('base64');
            mimeType = req.file.mimetype || 'image/jpeg';
        } else if (req.body.image) {
            // Base64 string in JSON body
            base64Image = req.body.image.replace(/^data:[^;]+;base64,/, '');
            mimeType = req.body.mimeType || 'image/jpeg';
        } else {
            return res.status(400).json({ error: 'No image provided. Send as file upload or base64 in body.' });
        }

        console.log(`📸 Analyzing image (${mimeType})...`);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = FULL_ANALYSIS_PROMPT + '\n\nAnalyze the product in this image:';
        const result = await withRetry(() =>
            model.generateContent([
                prompt,
                { inlineData: { data: base64Image, mimeType } }
            ])
        );

        const responseText = result.response.text();
        const data = parseAIResponse(responseText);

        console.log(`✅ Identified: ${data.product?.name} by ${data.product?.brand}`);
        res.json(data);

    } catch (error) {
        console.error('❌ Analysis error:', error.message);
        res.status(500).json({ error: 'AI analysis failed', details: error.message });
    }
});

// ─── POST /api/analyze-barcode ────────────────────────────────────────────
// Accepts a barcode string, asks Gemini to identify and analyze
app.post('/api/analyze-barcode', async (req, res) => {
    try {
        const { barcode } = req.body;
        if (!barcode) {
            return res.status(400).json({ error: 'No barcode provided' });
        }

        console.log(`🔍 Looking up barcode: ${barcode}`);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = FULL_ANALYSIS_PROMPT +
            `\n\nIdentify and analyze the product with barcode: ${barcode}. If unsure, make your best guess based on common products with similar barcodes.`;

        const result = await withRetry(() => model.generateContent(prompt));
        const responseText = result.response.text();
        const data = parseAIResponse(responseText);

        console.log(`✅ Barcode ${barcode} → ${data.product?.name} by ${data.product?.brand}`);
        res.json(data);

    } catch (error) {
        console.error('❌ Barcode lookup error:', error.message);
        res.status(500).json({ error: 'Barcode lookup failed', details: error.message });
    }
});

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start server ─────────────────────────────────────────────────────────
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`
      🌿 Eco Scanner Backend Server
      ────────────────────────────
      🚀 Running on http://localhost:${PORT}
      📡 Endpoints:
         POST /api/analyze         (image upload or base64)
         POST /api/analyze-barcode (barcode string)
         GET  /api/health          (health check)
      `);
    });
}

module.exports = app;
