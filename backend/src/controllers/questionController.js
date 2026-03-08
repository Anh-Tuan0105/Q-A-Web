import Question from "../models/Question.js";
import Tag from "../models/Tag.js";
import Vote from "../models/Vote.js";
import mongoose from "mongoose";

// Tạo câu hỏi mới
export const createQuestion = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const userId = req.user._id;

        // Xử lý danh sách tags báo về: mảng các object tên tag
        let tagIds = [];
        if (tags && Array.isArray(tags)) {
            for (let tagName of tags) {
                if (!tagName || typeof tagName !== 'string') continue;
                let tagStr = tagName.trim().toLowerCase();
                if (!tagStr) continue;

                let existingTag = await Tag.findOne({ name: tagStr });
                if (existingTag) {
                    existingTag.totalQuestion += 1;
                    await existingTag.save();
                    tagIds.push(existingTag._id);
                } else {
                    const newTag = new Tag({
                        name: tagStr,
                        description: `A tag for ${tagStr}`,
                        totalQuestion: 1,
                    });
                    const savedTag = await newTag.save();
                    tagIds.push(savedTag._id);
                }
            }
        }

        const newQuestion = new Question({
            userId,
            title,
            content,
            tags: tagIds,
            lastActivityUser: userId,
        });

        await newQuestion.save();

        res.status(201).json({
            success: true,
            message: "Tạo câu hỏi thành công",
            question: newQuestion,
        });
    } catch (error) {
        console.error("Lỗi trong createQuestion:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

// Lấy danh sách câu hỏi
export const getQuestions = async (req, res) => {
    try {
        // Cập nhật limit mặc định thành 4 để lấy tối đa 4 câu hỏi hiển thị
        const { page = 1, limit = 4, sort = "interesting", tag } = req.query;
        let query = {};
        let sortOptions = {};

        // 1. Xử lý filter theo tag
        if (tag) {
            const foundTag = await Tag.findOne({ name: tag.trim().toLowerCase() });
            if (foundTag) {
                query.tags = foundTag._id;
            } else {
                // Nếu tag không tồn tại, trả về danh sách rỗng để tránh fetch toàn bộ
                return res.status(200).json({
                    success: true,
                    questions: [],
                    totalPages: 0,
                    currentPage: parseInt(page),
                    totalQuestions: 0
                });
            }
        }

        // 2. Xử lý sort (thú vị, nóng, tuần, tháng)
        const now = new Date();
        switch (sort) {
            case "hot":
                sortOptions = { viewCount: -1, upvoteCount: -1, createdAt: -1 };
                break;
            case "week":
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(now.getDate() - 7);
                query.createdAt = { $gte: oneWeekAgo };
                sortOptions = { upvoteCount: -1, viewCount: -1, createdAt: -1 };
                break;
            case "month":
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(now.getMonth() - 1);
                query.createdAt = { $gte: oneMonthAgo };
                sortOptions = { upvoteCount: -1, viewCount: -1, createdAt: -1 };
                break;
            case "interesting":
            default:
                // Theo mặc định, sắp xếp câu hỏi thú vị bằng hoạt động gần nhất
                sortOptions = { lastActivityAt: -1 };
                break;
        }

        // 3. Phân trang và Lấy dữ liệu
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalQuestions = await Question.countDocuments(query);
        const totalPages = Math.ceil(totalQuestions / parseInt(limit));

        const questions = await Question.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .populate("userId", "username profilePicture") // Lấy thông tin cơ bản của user
            .populate("tags", "name") // Lấy tên các tag
            .populate("lastActivityUser", "username profilePicture"); // Lấy user tương tác cuối

        res.status(200).json({
            success: true,
            questions,
            totalPages,
            currentPage: parseInt(page),
            totalQuestions
        });
    } catch (error) {
        console.error("Lỗi trong getQuestions:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

// Lấy chi tiết câu hỏi
export const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID câu hỏi không hợp lệ" });
        }

        // Tìm câu hỏi và tăng viewCount bằng findByIdAndUpdate
        const question = await Question.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true } // Trả về document sau khi update
        )
            .populate("userId", "username profilePicture")
            .populate("tags", "name description");

        if (!question) {
            return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi" });
        }

        res.status(200).json({
            success: true,
            question
        });
    } catch (error) {
        console.error("Lỗi trong getQuestionById:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

// Cập nhật câu hỏi
export const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID câu hỏi không hợp lệ" });
        }

        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi" });
        }

        // Chỉ tác giả mới được sửa
        if (question.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền chỉnh sửa câu hỏi này" });
        }

        // Xử lý cập nhật Tag
        // Nếu tags truyền vào khác tags cũ, cần cập nhật totalQuestion cho Tag
        let newTagIds = question.tags; // Mặc định giữ lại id cũ
        if (tags && Array.isArray(tags)) {
            newTagIds = [];

            const oldTagIds = question.tags;
            // Giảm totalQuestion của các old tags
            await Tag.updateMany(
                { _id: { $in: oldTagIds } },
                { $inc: { totalQuestion: -1 } }
            );

            // Xử lý các tag mới được truyền vào
            for (let tagName of tags) {
                if (!tagName || typeof tagName !== 'string') continue;
                let tagStr = tagName.trim().toLowerCase();
                if (!tagStr) continue;

                let existingTag = await Tag.findOne({ name: tagStr });
                if (existingTag) {
                    existingTag.totalQuestion += 1;
                    await existingTag.save();
                    newTagIds.push(existingTag._id);
                } else {
                    const newTag = new Tag({
                        name: tagStr,
                        description: `A tag for ${tagStr}`,
                        totalQuestion: 1,
                    });
                    const savedTag = await newTag.save();
                    newTagIds.push(savedTag._id);
                }
            }
        }

        // Cập nhật câu hỏi
        question.title = title || question.title;
        question.content = content || question.content;
        question.tags = newTagIds;
        question.lastActivityAt = new Date();
        question.lastActivityUser = userId;

        await question.save();

        res.status(200).json({
            success: true,
            message: "Cập nhật câu hỏi thành công",
            question
        });
    } catch (error) {
        console.error("Lỗi trong updateQuestion:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

// Xóa câu hỏi
export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID câu hỏi không hợp lệ" });
        }

        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi" });
        }

        if (question.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền xóa câu hỏi này" });
        }

        // Giảm totalQuestion của các tag liên quan
        await Tag.updateMany(
            { _id: { $in: question.tags } },
            { $inc: { totalQuestion: -1 } }
        );

        // Xóa tất cả Vote liên kết với câu hỏi này
        await Vote.deleteMany({ targetType: "Question", quesId: question._id });

        // Tiến hành xóa câu hỏi
        await Question.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Đã xóa câu hỏi thành công",
        });

    } catch (error) {
        console.error("Lỗi trong deleteQuestion:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

// Bình chọn câu hỏi (Upvote/Downvote)
export const voteQuestion = async (req, res) => {
    try {
        const { id } = req.params; // ID câu hỏi
        const { value } = req.body; // 1 hoặc -1
        const userId = req.user._id;

        if (![1, -1].includes(value)) {
            return res.status(400).json({ success: false, message: "Value phải là 1 (upvote) hoặc -1 (downvote)" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID câu hỏi không hợp lệ" });
        }

        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi" });
        }

        // Không cho phép tự vote cho bài của chính mình
        if (question.userId.toString() === userId.toString()) {
            return res.status(400).json({ success: false, message: "Bạn không thể tự bình chọn cho câu hỏi của chính mình" });
        }

        // Kiểm tra xem user này đã vote cho câu hỏi này chưa
        const existingVote = await Vote.findOne({
            userId,
            targetType: "Question",
            quesId: id
        });

        if (existingVote) {
            // Nếu vote giống lần trước (ví dụ đã upvote, bấm thêm lần nữa) -> Xóa vote (toggle)
            if (existingVote.value === value) {
                await Vote.findByIdAndDelete(existingVote._id);
                // Giảm biến đếm tương ứng ở Question
                if (value === 1) question.upvoteCount -= 1;
                if (value === -1) question.downvoteCount -= 1;

                await question.save();
                return res.status(200).json({
                    success: true,
                    message: "Đã hủy bỏ vote",
                    question
                });
            } else {
                // Nếu lần trước upvote (1), giờ downvote (-1)
                // Hoặc lần trước downvote (-1), giờ upvote (1)
                existingVote.value = value;
                await existingVote.save();

                if (value === 1) {
                    question.upvoteCount += 1;
                    question.downvoteCount -= 1;
                } else {
                    question.upvoteCount -= 1;
                    question.downvoteCount += 1;
                }

                await question.save();
                return res.status(200).json({
                    success: true,
                    message: "Đã cập nhật vote thành công",
                    question
                });
            }
        } else {
            // Nếu chưa vote bao giờ, tạo mới
            const newVote = new Vote({
                userId,
                quesId: id,
                value,
                targetType: "Question"
            });
            await newVote.save();

            if (value === 1) question.upvoteCount += 1;
            if (value === -1) question.downvoteCount += 1;

            await question.save();
            return res.status(200).json({
                success: true,
                message: "Đã vote thành công",
                question
            });
        }

    } catch (error) {
        console.error("Lỗi trong voteQuestion:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};
