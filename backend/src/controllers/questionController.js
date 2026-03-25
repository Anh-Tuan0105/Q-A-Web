import Question from "../models/Question.js";
import Tag from "../models/Tag.js";
import Vote from "../models/Vote.js";
import Report from "../models/Report.js";
import mongoose from "mongoose";
import { io } from "../lib/socket.js";
import { generateEmbedding } from "../services/ai.service.js";
import { validateContent } from "../services/moderation.service.js";
import { createNotification } from "../services/notification.service.js";

const MODERATION_PENDING_MSG =
    "Bài đăng của bạn có nội dung cần được xem xét thêm trước khi hiển thị. Chúng tôi sẽ thông báo kết quả cho bạn sớm nhất.";

// Tạo câu hỏi mới
export const createQuestion = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const userId = req.user._id;

        // Kiểm duyệt nội dung trước khi lưu
        const moderation = await validateContent({ title, content, tags }, 'Question', userId);

        // Nếu nội dung bị gắn cờ → lưu với status pending, không chặn
        if (!moderation.safe) {
            const pendingQuestion = new Question({
                userId,
                title,
                content,
                tags: [], // Tags sẽ được thêm sau khi Admin duyệt
                lastActivityUser: userId,
                status: 'pending',
            });
            await pendingQuestion.save();

            // Cập nhật Report vừa tạo để liên kết với questionId
            await Report.findOneAndUpdate(
                { userId, contentType: 'Question', status: 'Pending' },
                { $set: { 'originalData.questionId': pendingQuestion._id, 'originalData.tags': tags } },
                { sort: { createdAt: -1 } }
            );

            // Gửi thông báo hệ thống cho tác giả (pending notification)
            await createNotification({
                receiverId: userId,
                senderId: userId, // Hệ thống tự gửi (hoặc dùng admin id nếu có system account)
                targetId: pendingQuestion._id,
                targetType: 'Question',
                type: 'rejected', // Dùng UI rejected (màu đỏ/vàng) tạm thời hoặc thêm type mới
                message: "Bài đăng của bạn đang chờ quản trị viên phê duyệt trước khi hiển thị."
            });

            return res.status(202).json({
                success: true,
                pending: true,
                message: MODERATION_PENDING_MSG,
                questionId: pendingQuestion._id,
            });
        }


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

        // Auto-generate embedding cho câu hỏi mới (fire-and-forget để không làm chậm response)
        generateEmbedding(title).then(embedding => {
            if (embedding) {
                Question.updateOne({ _id: newQuestion._id }, { $set: { embedding } }).catch(() => {});
            }
        }).catch(() => {});

        const populatedQuestion = await Question.findById(newQuestion._id)
            .populate("userId", "userName displayName avatarUrl")
            .populate("tags", "name")
            .populate("lastActivityUser", "userName displayName avatarUrl");

        io.emit("new_question", populatedQuestion);

        res.status(201).json({
            success: true,
            message: "Tạo câu hỏi thành công",
            question: populatedQuestion,
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
        const { page = 1, limit = 4, sort = "interesting", tag, keyword, status } = req.query;
        let query = {};
        let sortOptions = {};

        // 0. Xử lý Status & Search keyword
        if (status && status !== 'all') {
            query.status = status;
        }

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { content: { $regex: keyword, $options: "i" } }
            ];
        }

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

        // 2. Xử lý sort
        const now = new Date();
        switch (sort) {
            case "newest":
                sortOptions = { createdAt: -1 };
                break;
            case "unanswered":
                query.answersCount = 0;
                sortOptions = { createdAt: -1 };
                break;
            case "most-viewed":
                sortOptions = { viewCount: -1, createdAt: -1 };
                break;
            case "most-voted":
                sortOptions = { upvoteCount: -1, viewCount: -1, createdAt: -1 };
                break;
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
            .populate("userId", "userName displayName avatarUrl") // Lấy thông tin cơ bản của user
            .populate("tags", "name") // Lấy tên các tag
            .populate("lastActivityUser", "userName displayName avatarUrl"); // Lấy user tương tác cuối

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
            { returnDocument: 'after' } // Trả về document sau khi update
        )
            .populate("userId", "userName displayName avatarUrl")
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

        if (question.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
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
            // Đã vote rồi thì không được vote lại (kể cả Upvote hay Downvote)
            return res.status(400).json({
                success: false,
                message: "Bạn đã vote cho câu hỏi này rồi, không thể thay đổi hoặc vote thêm"
            });
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
