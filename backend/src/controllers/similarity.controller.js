import { findSimilarQuestions } from '../services/similarity.service.js';

/**
 * POST /api/similarity/questions
 * Body: { title: string, excludeId?: string }
 * Returns tối đa 5 câu hỏi tương đồng nhất
 */
export const getSimilarQuestions = async (req, res) => {
    const { title, excludeId } = req.body;

    if (!title || title.trim().length < 10) {
        return res.status(400).json({ message: 'Tiêu đề câu hỏi quá ngắn (cần ít nhất 10 ký tự).' });
    }

    try {
        const results = await findSimilarQuestions(title.trim(), excludeId || null);
        return res.status(200).json(results);
    } catch (error) {
        console.error('Similarity check error:', error.message);
        return res.status(500).json({ message: 'Lỗi server khi kiểm tra câu hỏi tương đồng.' });
    }
};
