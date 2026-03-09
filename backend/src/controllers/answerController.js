import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import Vote from "../models/Vote.js";
import mongoose from "mongoose";
import { io } from "../lib/socket.js";

// Tạo câu trả lời mới
export const createAnswer = async (req, res) => {
    try {
        const { quesId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(quesId)) {
            return res.status(400).json({ success: false, message: "ID câu hỏi không hợp lệ" });
        }

        const question = await Question.findById(quesId);
        if (!question) {
            return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi" });
        }

        // Kiểm tra xem User đã trả lời câu hỏi này chưa
        const existingAnswer = await Answer.findOne({ quesId, userId });
        if (existingAnswer) {
            return res.status(400).json({ success: false, message: "Bạn đã trả lời câu hỏi này rồi. Vui lòng chỉnh sửa câu trả lời hiện tại của bạn" });
        }

        const newAnswer = new Answer({
            quesId,
            userId,
            content,
        });

        await newAnswer.save();

        // Cập nhật số lượng câu trả lời và thời gian hoạt động của câu hỏi
        question.answersCount += 1;
        question.lastActivityAt = new Date();
        question.lastActivityUser = userId;
        await question.save();

        const populatedAnswer = await Answer.findById(newAnswer._id)
            .populate("userId", "userName displayName avatarUrl");

        io.to(`room_question_${quesId}`).emit("new_answer", populatedAnswer);

        res.status(201).json({
            success: true,
            message: "Tạo câu trả lời thành công",
            answer: populatedAnswer,
        });
    } catch (error) {
        console.error("Lỗi trong createAnswer:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

// Lấy danh sách câu trả lời theo câu hỏi
export const getAnswersByQuestion = async (req, res) => {
    try {
        const { quesId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(quesId)) {
            return res.status(400).json({ success: false, message: "ID câu hỏi không hợp lệ" });
        }

        // Lấy tất cả câu trả lời cho câu hỏi này
        // Sắp xếp: ưu tiên isAccepted = true lên đầu, sau đó sắp xếp theo vote (cao xuống thấp), rồi đến thời gian
        const answers = await Answer.find({ quesId })
            .sort({ isAccepted: -1, upvoteCount: -1, createdAt: 1 })
            .populate("userId", "userName displayName avatarUrl"); // Lấy thông tin người trả lời

        res.status(200).json({
            success: true,
            answers,
        });
    } catch (error) {
        console.error("Lỗi trong getAnswersByQuestion:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

// Cập nhật câu trả lời
export const updateAnswer = async (req, res) => {
    try {
        const { id } = req.params; // ID của answer
        const { content } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID câu trả lời không hợp lệ" });
        }

        const answer = await Answer.findById(id);

        if (!answer) {
            return res.status(404).json({ success: false, message: "Không tìm thấy câu trả lời" });
        }

        // Chỉ tác giả mới được sửa
        if (answer.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền chỉnh sửa câu trả lời này" });
        }

        answer.content = content || answer.content;
        await answer.save();

        res.status(200).json({
            success: true,
            message: "Cập nhật câu trả lời thành công",
            answer
        });
    } catch (error) {
        console.error("Lỗi trong updateAnswer:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

// Xóa câu trả lời
export const deleteAnswer = async (req, res) => {
    try {
        const { id } = req.params; // ID của answer
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID câu trả lời không hợp lệ" });
        }

        const answer = await Answer.findById(id);

        if (!answer) {
            return res.status(404).json({ success: false, message: "Không tìm thấy câu trả lời" });
        }

        if (answer.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền xóa câu trả lời này" });
        }

        // Tìm câu hỏi liên quan để giảm answersCount
        const question = await Question.findById(answer.quesId);
        if (question) {
            question.answersCount -= 1;
            await question.save();
        }

        // Xóa tất cả Vote liên kết với câu trả lời này
        await Vote.deleteMany({ targetType: "Answer", ansId: id });

        // Tiến hành xóa
        await Answer.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Đã xóa câu trả lời thành công",
        });

    } catch (error) {
        console.error("Lỗi trong deleteAnswer:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

// Bình chọn câu trả lời (Upvote/Downvote)
export const voteAnswer = async (req, res) => {
    try {
        const { id } = req.params; // ID của answer
        const { value } = req.body; // 1 hoặc -1
        const userId = req.user._id;

        if (![1, -1].includes(value)) {
            return res.status(400).json({ success: false, message: "Value phải là 1 (upvote) hoặc -1 (downvote)" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID câu trả lời không hợp lệ" });
        }

        const answer = await Answer.findById(id);
        if (!answer) {
            return res.status(404).json({ success: false, message: "Không tìm thấy câu trả lời" });
        }

        // Không cho phép tự vote cho bài của chính mình
        if (answer.userId.toString() === userId.toString()) {
            return res.status(400).json({ success: false, message: "Bạn không thể tự bình chọn cho câu trả lời của chính mình" });
        }

        // Kiểm tra xem user này đã vote chưa
        const existingVote = await Vote.findOne({
            userId,
            targetType: "Answer",
            ansId: id
        });

        if (existingVote) {
            // Đã vote rồi thì không được vote lại (kể cả Upvote hay Downvote)
            return res.status(400).json({
                success: false,
                message: "Bạn đã vote cho câu trả lời này rồi, không thể thay đổi hoặc vote thêm"
            });
        } else {
            // Chưa vote
            const newVote = new Vote({
                userId,
                ansId: id,
                value,
                targetType: "Answer"
            });
            await newVote.save();

            if (value === 1) answer.upvoteCount += 1;
            if (value === -1) answer.downvoteCount += 1;

            await answer.save();
            return res.status(200).json({
                success: true,
                message: "Đã vote thành công",
                answer
            });
        }

    } catch (error) {
        console.error("Lỗi trong voteAnswer:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

// Đánh dấu câu trả lời được chấp nhận
export const acceptAnswer = async (req, res) => {
    try {
        const { id } = req.params; // ID của answer
        const { quesId } = req.body; // ID của câu hỏi đang xem
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(quesId)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ" });
        }

        const answerToAccept = await Answer.findById(id);
        if (!answerToAccept) {
            return res.status(404).json({ success: false, message: "Không tìm thấy câu trả lời" });
        }

        // CHỐNG HACK: Xác minh câu trả lời này thực sự thuộc về câu hỏi đang xem
        if (answerToAccept.quesId.toString() !== quesId.toString()) {
            return res.status(400).json({ success: false, message: "Câu trả lời này không thuộc về câu hỏi hiện tại" });
        }

        const question = await Question.findById(answerToAccept.quesId);
        if (!question) {
            return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi tương ứng" });
        }

        // CHỈ NGƯỜI TẠO CÂU HỎI MỚI CÓ QUYỀN DUYỆT CÂU TRẢ LỜI
        if (question.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Chỉ người đăng bài mới có quyền duyệt câu trả lời" });
        }

        // Bỏ chọn câu trả lời cũ (nếu có) thuộc về câu hỏi này
        await Answer.updateMany(
            { quesId: question._id, _id: { $ne: answerToAccept._id } },
            { $set: { isAccepted: false } }
        );

        // Toggle trạng thái của câu trả lời được click
        answerToAccept.isAccepted = !answerToAccept.isAccepted;
        await answerToAccept.save();

        // Đánh dấu id câu hỏi là đã được giải quyết (Tuỳ chọn: nếu muốn Question có status 'resolved')
        question.status = "resolved";
        question.lastActivityAt = new Date();
        question.lastActivityUser = userId;
        await question.save();

        res.status(200).json({
            success: true,
            message: "Đã đánh dấu câu trả lời đúng thành công",
            answer: answerToAccept
        });

    } catch (error) {
        console.error("Lỗi trong acceptAnswer:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};
