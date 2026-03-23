const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// API Key provided by user
const genAI = new GoogleGenerativeAI('AIzaSyBRja-leJhEcKaSk9imCP3PnLFIHhOD104');
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

const promptsPath = path.join(__dirname, '../prompts.json');
const outPath = path.join(__dirname, '../es/prompts-es.json');

const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Process in chunks of 15 to stay well within limits and payload sizes
const CHUNK_SIZE = 15;
const delay = ms => new Promise(res => setTimeout(res, ms));

async function translateChunk(chunk) {
    const systemInstruction = `Translate the following JSON array of objects from English to native, professional Spanish. 
Maintain the exact same JSON structure, keys ("title", "category", "prompt", "exampleResult", "useCases", "proTips"), and arrays. 
Only translate the inner string values. 
Do not translate the JSON keys themselves.
DO NOT wrap the output in markdown codeblocks (no \`\`\`json). Return ONLY the raw valid JSON string.`;

    const promptText = `${systemInstruction}\n\nJSON:\n${JSON.stringify(chunk, null, 2)}`;

    try {
        const result = await model.generateContent(promptText);
        let text = result.response.text();
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (e) {
        console.error("❌ Error parsing or fetching from Gemini. Retrying in 5 seconds...");
        await delay(5000);
        const result = await model.generateContent(promptText);
        let text = result.response.text();
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    }
}

async function run() {
    console.log(`🚀 Starting translation for ${prompts.length} prompts...`);
    let translatedPrompts = [];
    
    // Ensure the /es/ directory exists
    if (!fs.existsSync(path.dirname(outPath))) {
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
    }

    // Resume capability
    if (fs.existsSync(outPath)) {
        try {
            translatedPrompts = JSON.parse(fs.readFileSync(outPath, 'utf8'));
            console.log(`✅ Resuming from index ${translatedPrompts.length}...`);
        } catch(e) {
            console.log("Could not parse existing output. Starting from scratch.");
        }
    }

    for (let i = translatedPrompts.length; i < prompts.length; i += CHUNK_SIZE) {
        const chunk = prompts.slice(i, i + CHUNK_SIZE);
        console.log(`⏳ Translating chunk [${i} to ${i + CHUNK_SIZE - 1}]...`);
        
        try {
            const translatedChunk = await translateChunk(chunk);
            if (!Array.isArray(translatedChunk)) {
                 throw new Error("Gemini did not return a valid array");
            }
            translatedPrompts = translatedPrompts.concat(translatedChunk);
            fs.writeFileSync(outPath, JSON.stringify(translatedPrompts, null, 2));
            console.log(`✅ Successfully saved up to ${translatedPrompts.length} prompts.`);
        } catch (e) {
            console.error(`💥 Failed at chunk ${i}. Halting script to save progress.`, e);
            break;
        }

        // 4.5 seconds delay respects the 15 Requests Per Minute (RPM) free tier limit
        if (i + CHUNK_SIZE < prompts.length) {
            await delay(4500);
        }
    }
    
    console.log("🎉 Translation Migration Complete!");
}

run();
