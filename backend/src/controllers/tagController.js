import Tag from "../models/Tag.js";

export const getPopularTags = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;

        // Fetch tags sorted by totalQuestion descending
        const popularTags = await Tag.find()
            .sort({ totalQuestion: -1 })
            .limit(limit)
            .select("name totalQuestion");

        res.status(200).json({
            success: true,
            tags: popularTags,
        });
    } catch (error) {
        console.error("Lỗi khi lấy phổ biến Tags:", error.message);
        res.status(500).json({
            success: false,
            message: "Lỗi Server, vui lòng thử lại sau.",
            error: error.message,
        });
    }
};
