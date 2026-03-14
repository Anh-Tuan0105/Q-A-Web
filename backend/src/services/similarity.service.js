import Question from '../models/Question.js';
import { generateEmbedding } from './ai.service.js';

/**
 * Tính điểm Cosine Similarity giữa hai vector
 * @param {number[]} vecA 
 * @param {number[]} vecB 
 * @returns {number} Điểm từ 0 (khác hoàn toàn) đến 1 (giống hệt nhau)
 */
const cosineSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

/**
 * Tìm kiếm các câu hỏi tương đồng với nội dung người dùng nhập
 * @param {string} queryText - Nội dung câu hỏi mới
 * @param {string|null} excludeId - ID câu hỏi hiện tại để loại trừ (khi edit)
 * @param {number} limit - Số lượng kết quả tối đa (default: 5)
 * @returns {Promise<Array>} Danh sách câu hỏi tương đồng kèm điểm score
 */
export const findSimilarQuestions = async (queryText, excludeId = null, limit = 5) => {
    // 1. Sinh embedding cho câu hỏi người dùng đang nhập
    const queryEmbedding = await generateEmbedding(queryText);

    if (!queryEmbedding) {
        // Fallback: dùng MongoDB text search nếu Gemini API không khả dụng
        const filter = { $text: { $search: queryText } };
        if (excludeId) filter._id = { $ne: excludeId };

        const results = await Question.find(filter, { score: { $meta: 'textScore' }, title: 1, _id: 1 })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit)
            .select('title _id');

        // Chỉ lấy những kết quả có textScore đủ cao (tùy chỉnh ngưỡng nếu cần)
        return results
            .filter(q => q._doc.score > 2) // Ngưỡng ví dụ cho textScore
            .map(q => ({
                _id: q._id,
                title: q.title,
                similarity: null,
            }));
    }

    // 2. Lấy tất cả câu hỏi đã có embedding từ DB
    const filter = { embedding: { $exists: true, $not: { $size: 0 } } };
    if (excludeId) filter._id = { $ne: excludeId };

    const questions = await Question.find(filter).select('title _id embedding').lean();

    // 3. Tính Cosine Similarity cho từng câu hỏi
    const scored = questions.map(q => ({
        _id: q._id,
        title: q.title,
        similarity: cosineSimilarity(queryEmbedding, q.embedding),
    }));

    // 4. Sắp xếp theo điểm giảm dần và lấy top `limit`
    // Tăng ngưỡng lên 0.75 (75%) để đảm bảo độ chính xác cao hơn
    const MIN_SIMILARITY = 0.75; 
    return scored
        .filter(q => q.similarity >= MIN_SIMILARITY)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
};
