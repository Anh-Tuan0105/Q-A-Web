import { checkBlacklist } from "../helpers/vi-blacklist.js";
import { moderateWithGemini } from "./ai.service.js";
import Report from "../models/Report.js";

/**
 * Điều phối việc kiểm duyệt nội dung qua 2 lớp: Blacklist và Gemini AI
 * @param {Object} data Dữ liệu nội dung (title, content, tags...)
 * @param {string} type Loại nội dung ('Question', 'Answer', 'Comment')
 * @param {string} userId ID người tạo
 * @returns {Promise<{safe: boolean, reason?: string}>}
 */
export const validateContent = async (data, type, userId) => {
    const { title, content } = data;
    const fullText = `${title || ""} ${content || ""}`;

    // Lớp 1: Kiểm tra Blacklist (nhanh, miễn phí)
    const blacklistViolation = checkBlacklist(fullText);
    if (blacklistViolation) {
        const report = await Report.create({
            content: { title, body: content },
            contentType: type,
            reason: `Blacklist: chứa từ "${blacklistViolation}"`,
            userId,
            originalData: data
        });
        const { io } = await import('../lib/socket.js');
        io.emit('new_report', report);
        
        return { safe: false, reason: "Nội dung vi phạm từ cấm." };
    }

    // Lớp 2: Kiểm tra bằng Gemini AI (nếu Blacklist sạch)
    try {
        const aiResult = await moderateWithGemini(fullText);
        if (!aiResult.isSafe) {
            const report = await Report.create({
                content: { title, body: content },
                contentType: type,
                reason: `AI Detection: ${aiResult.reason}`,
                userId,
                originalData: data
            });
            const { io } = await import('../lib/socket.js');
            io.emit('new_report', report);
            
            return { safe: false, reason: "Nội dung bị hệ thống AI từ chối." };
        }
    } catch (error) {
        console.error("Lỗi khi gọi Gemini moderation:", error);
        // Tùy chọn: Nếu AI lỗi, có thể cho qua hoặc chặn lại. Ở đây ta tạm cho qua để không chặn người dùng vô lý.
    }

    return { safe: true };
};
