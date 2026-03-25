import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

let aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prompt = "Ban la ai?";

async function run() {
    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });
        console.log(response.text);
    } catch (e) {
        console.error("FULL ERROR:");
        console.error(e);
    }
}
run();
