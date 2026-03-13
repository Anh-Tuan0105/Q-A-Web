import Tag from "../models/Tag.js";

/**
 * Trích xuất các từ có ý nghĩa từ văn bản (bỏ stop words, ký tự đặc biệt).
 * @param {string} text - Chuỗi văn bản đầu vào.
 * @returns {string[]} Mảng các từ đã được chuẩn hóa.
 */
const extractKeywords = (text) => {
    if (!text) return [];
    // Chuyển về lowercase và tách theo ký tự không phải chữ/số
    const words = text.toLowerCase().split(/[^a-z0-9#+.]/);
    // Lọc bỏ các từ quá ngắn (< 2 ký tự)
    return [...new Set(words.filter((w) => w.length >= 2))];
};

/**
 * Gợi ý tags từ title và body bằng cách so khớp từ khóa với tên tag trong DB.
 * @param {string} title - Tiêu đề câu hỏi.
 * @param {string} body - Nội dung câu hỏi.
 * @returns {Promise<string[]>} Mảng tối đa 5 tên tag được gợi ý.
 */
export const suggestTagsByText = async (title, body) => {
    const keywords = extractKeywords(`${title} ${body}`);
    if (keywords.length === 0) return [];

    // Tạo regex pattern từ các từ khóa để tìm trong DB
    const regexPatterns = keywords.map((kw) => ({
        name: { $regex: `^${kw}$`, $options: "i" },
    }));

    const matchedTags = await Tag.find({ $or: regexPatterns })
        .sort({ totalQuestion: -1 })
        .limit(5)
        .select("name");

    return matchedTags.map((tag) => tag.name);
};
