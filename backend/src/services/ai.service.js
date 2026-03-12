import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient = null;
if (process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
    console.warn("WARNING: GEMINI_API_KEY is not set. AI Features will be disabled.");
}

/**
 * Sinh vector embedding cho nội dung văn bản sử dụng Gemini API
 * @param {string} text Nội dung câu hỏi 
 * @returns {Promise<number[] | null>} Vector embedding hoặc null nếu lỗi
 */
export const generateEmbedding = async (text) => {
    if (!aiClient) return null;
    
    try {
        // Sử dụng mô hình chuyên dụng cho embedding (vd: gemini-embedding-001 hoặc text-embedding-004)
        const response = await aiClient.models.embedContent({
            model: 'gemini-embedding-001',
            contents: text,
        });
        
        // Trả về mảng các số thực (floats)
        return response.embeddings[0].values;
    } catch (error) {
        console.error("Error generating embedding from AI:", error.message);
        return null;
    }
};
