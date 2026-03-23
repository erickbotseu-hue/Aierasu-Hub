const fs = require('fs');
const path = require('path');
const deepl = require('deepl-node');

const authKey = '5a657eb4-4b33-41a4-8ed3-c8c6ec39ac73:fx';
const translator = new deepl.Translator(authKey);

const promptsPath = path.join(__dirname, '../prompts.json');
const outPath = path.join(__dirname, '../es/prompts-es.json');

const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

// Batch process 50 prompts (100 strings) per API request to maximize throughput
async function run() {
    console.log(`🚀 Starting Accelerated DeepL translation for ${prompts.length} prompts...`);

    let translatedPrompts = [];
    if (fs.existsSync(outPath)) {
        try {
            translatedPrompts = JSON.parse(fs.readFileSync(outPath, 'utf8'));
            console.log(`✅ Resuming from index ${translatedPrompts.length}...`);
        } catch (e) {
            console.log("Could not parse existing output. Starting from scratch.");
        }
    }

    let charCount = 0;
    const batchSize = 10;

    for (let i = translatedPrompts.length; i < prompts.length; i += batchSize) {
        const chunk = prompts.slice(i, i + batchSize);
        const stringsToTranslate = [];
        
        for (const p of chunk) {
            stringsToTranslate.push(p.prompt || '');
            stringsToTranslate.push(p.exampleResult || '');
        }
        
        try {
            // Translate the batch of up to 100 strings instantly
            const results = await translator.translateText(stringsToTranslate, null, 'es');
            
            for (let j = 0; j < chunk.length; j++) {
                const translatedPrompt = results[j * 2].text;
                const translatedExample = results[j * 2 + 1].text;
                
                charCount += stringsToTranslate[j*2].length + stringsToTranslate[j*2+1].length;

                const newPrompt = {
                    ...chunk[j],
                    prompt: translatedPrompt,
                    exampleResult: translatedExample
                };

                translatedPrompts.push(newPrompt);
            }

            // Save chunk to prevent losing progress
            fs.writeFileSync(outPath, JSON.stringify(translatedPrompts, null, 2));
            console.log(`✅ Fast Progress: Translated ${Math.min(i + batchSize, prompts.length)} / ${prompts.length} (Approx chars used: ${charCount})`);
        } catch (error) {
            console.error(`💥 Failed at index ${i}. Halting script to save progress. DeepL Error:`, error.message);
            break;
        }

        // Slight delay
        await new Promise(r => setTimeout(r, 500));
    }

    fs.writeFileSync(outPath, JSON.stringify(translatedPrompts, null, 2));
    console.log(`🎉 DeepL Translation Migration Complete! Total characters processed this run: ${charCount}`);
}

run();
