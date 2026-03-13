import Tag from "../models/Tag.js";
import { suggestTagsByText } from "../services/autoTag.service.js";

// Lấy danh sách tags có phân trang, search, sort
export const getTags = async (req, res) => {
    try {
        const { page = 1, limit = 16, sort = "popular", keyword } = req.query;
        let query = {};
        let sortOptions = {};

        // 1. Lọc theo từ khóa
        if (keyword) {
            query.name = { $regex: keyword, $options: "i" };
        }

        // 2. Sắp xếp
        switch (sort) {
            case "alphabetical":
                sortOptions = { name: 1 };
                break;
            case "newest":
                sortOptions = { createdAt: -1 };
                break;
            case "popular":
            default:
                sortOptions = { totalQuestion: -1, followers: -1 };
                break;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalTags = await Tag.countDocuments(query);
        const totalPages = Math.ceil(totalTags / parseInt(limit));

        const tags = await Tag.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            tags,
            totalPages,
            currentPage: parseInt(page),
            totalTags,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách Tags:", error.message);
        res.status(500).json({
            success: false,
            message: "Lỗi Server, vui lòng thử lại sau.",
            error: error.message,
        });
    }
};

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

export const incrementTagView = async (req, res) => {
    try {
        const { name } = req.params;
        const tag = await Tag.findOneAndUpdate(
            { name },
            { $inc: { viewCount: 1 } },
            { new: true }
        );

        if (!tag) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tag" });
        }

        res.status(200).json({ success: true, viewCount: tag.viewCount });
    } catch (error) {
        console.error("Lỗi khi cập nhật lượt xem tag:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};

export const suggestTags = async (req, res) => {
    try {
        const { title = "", body = "" } = req.body;

        if (!title.trim() && !body.trim()) {
            return res.status(200).json({ success: true, tags: [] });
        }

        const tags = await suggestTagsByText(title, body);
        res.status(200).json({ success: true, tags });
    } catch (error) {
        console.error("Lỗi khi gợi ý Tags:", error.message);
        res.status(500).json({ success: false, message: "Lỗi Server", error: error.message });
    }
};
