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
    dest: path.join(__dirname, 'uploads/'),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize Gemini AI
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.error('❌ API_KEY is missing! Create a .env file with API_KEY=your_key');
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(API_KEY);

// ─── The Prompt ───────────────────────────────────────────────────────────
const FULL_ANALYSIS_PROMPT = `
You are an expert product identification AI. Your #1 priority is to identify the EXACT product name and brand.

IDENTIFICATION RULES:
- **GOLDEN RULE**: TRUST THE TEXT ON THE PACKAGING ABOVE ALL ELSE.
- If the bottle says "Signature", the brand is "Signature", NOT Bisleri or Kinley.
- If the bottle says "Bisleri", the brand is "Bisleri".
- **OCR PRIORITY**: Read the largest text on the label. That is usually the brand.
- **Surrogate Products**: Be aware of brand extensions (e.g., "Seagram's Royal Stag" water/soda, "Signature" water/glassware). Identify them exactly as printed.
- Use the EXACT product name as printed on the label (e.g. "Signature Packaged Drinking Water").
- **CRITICAL**: DO NOT return generic names like "Water", "Bottle", "Soda". You MUST include the BRAND name.
- The "name" field must be: "[Brand] [Product Name] [Variant]" (e.g. "Signature Premium Packaged Drinking Water").
- The "brand" field must be the exact brand (e.g. "Signature").
- The "manufacturer" must be the parent company (e.g. "United Spirits Ltd" for Signature).

After identifying, return a COMPLETE environmental impact analysis as a single JSON object.
Be thorough and provide realistic, research-based estimates.

Return this EXACT JSON structure (no markdown, no code blocks, ONLY raw JSON):
{
  "product": {
    "id": "generated-unique-id",
    "name": "EXACT Product Name as on label",
    "brand": "EXACT Brand Name as on label",
    "manufacturer": "Parent Company Name",
    "country": "Country of Origin",
    "category": "Product Category",
    "type": "food" or "non-food",

    "ingredients": [
      { "name": "Ingredient Name", "carbonIntensity": 0.5, "waterIntensity": 100, "landUse": 1.2, "riskFactors": ["water-intensive"], "percentage": 30 }
    ],
    "nutrition": { "sugar": 10, "saturatedFat": 5, "sodium": 100, "additives": ["additive1"] },

    "materials": ["Material1", "Material2"],

    "packaging": {  
      "type": "mono-plastic",
      "material": "Plastic Bottle",
      "recyclability": 80,
      "instructions": "Rinse and recycle"
    },
    "esg": {
      "hasSustainabilityReport": true,
      "hasEthicalCertification": false,
      "carbonNeutralGoal": false,
      "transparencyScore": 60
    },
    "certifications": ["Organic"]
  },

  "sustainableScore": 62,
  "scoreLabel": "Moderate",

  "scoreBreakdown": {
    "carbon": 18,
    "water": 8,
    "energy": 6,
    "ingredientSustainability": 9,
    "health": 6,
    "packaging": 5,
    "esg": 10
  },

  "carbonTotal": 2.8,
  "waterTotal": 485,
  "healthScore": 42,
  "dataConfidence": "Estimated",

  "aiSummary": "2-3 sentence analysis of the product's environmental impact, health concerns, and notable sustainability aspects.",

  "alternatives": [
    {
      "id": "alt-001",
      "name": "Alternative Product Name",
      "brand": "Alt Brand",
      "sustainableScore": 78,
      "carbonReduction": 32,
      "packagingImprovement": "100% recyclable",
      "healthImprovement": "Less sugar, no palm oil"
    },
    {
      "id": "alt-002",
      "name": "Second Alternative",
      "brand": "Alt Brand 2",
      "sustainableScore": 85,
      "carbonReduction": 45,
      "packagingImprovement": "Compostable packaging",
      "healthImprovement": "Organic, no additives"
    }
  ],

  "disposalGuidance": {
    "classification": "Recyclable Plastic",
    "recyclable": true,
    "instructions": "Detailed disposal instructions for this specific product."
  },

  "radarData": [
    { "subject": "Carbon", "A": 60, "fullMark": 100 },
    { "subject": "Water", "A": 53, "fullMark": 100 },
    { "subject": "Energy", "A": 60, "fullMark": 100 },
    { "subject": "Packaging", "A": 50, "fullMark": 100 },
    { "subject": "Health", "A": 60, "fullMark": 100 },
    { "subject": "ESG", "A": 70, "fullMark": 100 }
  ],

  "barChartData": [
    { "name": "Ingredients", "value": 35, "color": "#2dd4bf" },
    { "name": "Manufacturing", "value": 28, "color": "#22c55e" },
    { "name": "Packaging", "value": 15, "color": "#0ea5e9" },
    { "name": "Transport", "value": 12, "color": "#8b5cf6" },
    { "name": "End of Life", "value": 10, "color": "#f59e0b" }
  ],

  "highlights": [
    { "type": "warning", "icon": "carbon", "text": "Specific carbon concern about THIS product" },
    { "type": "negative", "icon": "water", "text": "Specific water concern about THIS product" },
    { "type": "warning", "icon": "deforestation", "text": "Specific deforestation or land use concern" },
    { "type": "positive", "icon": "packaging", "text": "Specific packaging positive about THIS product" },
    { "type": "positive", "icon": "health", "text": "Specific health or ESG positive about THIS product" }
  ],

  "funFact": "An interesting, specific environmental fact related to THIS product's main ingredient or material. Include specific numbers to make it impactful."
}

CRITICAL RULES:
- sustainableScore: 0-100 where higher = more sustainable. Be STRICT and REALISTIC. Do NOT inflate scores.
  * Single-use plastic bottles/packaging: score should be 25-45 max.
  * Products with no eco-certifications: score should rarely exceed 50.
  * Products with palm oil or high deforestation risk: deduct 10-15 points.
  * Imported products with long supply chains: deduct 5-10 points for transport.
  * Only products with verified organic, fair-trade, recyclable packaging, AND local sourcing should score above 75.
- scoreBreakdown values should sum to approximately sustainableScore. carbon max=30, water max=15, energy max=10, ingredientSustainability max=15, health max=10, packaging max=10, esg max=10.
- For food: include "ingredients" and "nutrition", omit "materials".
- For non-food: include "materials", omit "ingredients" and "nutrition".
- radarData "A" values: 0-100 where higher = better performance in that category. Be strict here too.
- barChartData "value": percentage of total environmental impact from each lifecycle stage (should sum to ~100).
- carbonTotal: total kg CO2e per unit. Use realistic lifecycle values. waterTotal: total liters of water per unit.
- healthScore: 0-100 where higher = healthier. Sugary drinks/junk food should be 20-40. Plain water = 90+.
- alternatives: suggest 2 real or realistic products that are more sustainable.
- aiSummary: provide specific, actionable insights about THIS product.
- highlights: provide 3-5 bullet-point insights SPECIFIC to THIS product. Each should have type (positive/warning/negative) and icon (carbon/water/deforestation/packaging/health). DO NOT use generic text.
- funFact: a specific, interesting environmental fact related to THIS product's key ingredient or material. Include real statistics.
- Return ONLY the raw JSON. No markdown formatting, no code blocks, no explanatory text.
`;

// ─── Helper: Parse AI Response ────────────────────────────────────────────
function parseAIResponse(text) {
    let cleaned = text.trim();
    // Remove markdown code blocks if present
    cleaned = cleaned.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
    cleaned = cleaned.trim();
    return JSON.parse(cleaned);
}

// ─── Helper: Retry on rate limit ──────────────────────────────────────────
async function withRetry(fn, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isRateLimit = error.message?.includes('429');
            if (isRateLimit && attempt < maxRetries) {
                const delay = attempt * 3000;
                console.log(`⏳ Rate limited. Retrying in ${delay / 1000}s... (attempt ${attempt}/${maxRetries})`);
                await new Promise(r => setTimeout(r, delay));
            } else {
                throw error;
            }
        }
    }
    throw new Error('Max retries exceeded');
}

// ─── POST /api/analyze ────────────────────────────────────────────────────
// Accepts an image file upload, sends to Gemini, returns full analysis
app.post('/api/analyze', upload.single('image'), async (req, res) => {
    let imagePath = null;
    try {
        // Support both file upload and base64 in body
        let base64Image, mimeType;

        if (req.file) {
            // File upload via multipart
            imagePath = req.file.path;
            const imageBuffer = fs.readFileSync(imagePath);
            base64Image = imageBuffer.toString('base64');
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
    } finally {
        // Cleanup uploaded file
        if (imagePath) {
            try { fs.unlinkSync(imagePath); } catch (e) { /* ignore */ }
        }
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
