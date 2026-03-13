import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
    const models = await aiClient.models.list();
    for await (const m of models) {
        if (m.name.includes('embed') || m.name.includes('text')) {
             console.log(m.name, m.supportedGenerationMethods);
        }
    }
}   
run();
