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
        const response = await aiClient.models.embedContent({
            model: 'gemini-embedding-001',
            contents: text,
        });
        return response.embeddings[0].values;
    } catch (error) {
        console.error("Error generating embedding from AI:", error.message);
        return null;
    }
};

/**
 * Kiểm duyệt nội dung bằng Gemini AI
 * @param {string} text Nội dung cần kiểm tra
 * @returns {Promise<{isSafe: boolean, reason: string}>}
 */
export const moderateWithGemini = async (text) => {
    if (!aiClient) return { isSafe: true, reason: "AI disabled" };

    const prompt = `Bạn là hệ thống kiểm duyệt nội dung cho một trang web hỏi đáp kỹ thuật (kiểu Stack Overflow).
Hãy phân tích đoạn văn bản sau và xác định xem có vi phạm các tiêu chí sau không:
- Spam hoặc quảng cáo
- Lừa đảo hoặc thông tin sai lệch
- Nội dung thô tục, tục tĩu, xúc phạm
- Kích động bạo lực hoặc thù hằn
- Nội dung người lớn không phù hợp

Văn bản cần kiểm tra:
"${text.slice(0, 1500)}"

Trả về JSON thuần túy (không có markdown, không có dấu backtick):
{"isSafe": true/false, "reason": "Lý do vi phạm hoặc OK"}`;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });


        const raw = response.text?.trim() || '';
        const parsed = JSON.parse(raw);
        return {
            isSafe: Boolean(parsed.isSafe),
            reason: parsed.reason || "Không xác định"
        };
    } catch (error) {
        console.error("Lỗi khi gọi Gemini moderation:", error.message);
        // Nếu parse lỗi hoặc API lỗi, cho qua (fail open) để không chặn sai
        return { isSafe: true, reason: "AI error - bypassed" };
    }
};
