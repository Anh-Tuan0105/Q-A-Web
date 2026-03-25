import Report from "../models/Report.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import mongoose from "mongoose";
import { createNotification } from "../services/notification.service.js";
import { io } from "../lib/socket.js";

/**
 * Lấy danh sách báo cáo (admin)
 * GET /api/admin/reports?status=Pending&page=1&limit=10
 */
export const getReports = async (req, res) => {
    try {
        const { status = 'Pending', contentType, keyword, page = 1, limit = 10 } = req.query;

        const query = {};
        if (status !== 'all') query.status = status;
        if (contentType && contentType !== 'all') query.contentType = contentType;

        if (keyword) {
            query.$or = [
                { 'content.title': { $regex: keyword, $options: 'i' } },
                { 'content.body': { $regex: keyword, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Report.countDocuments(query);
        const reports = await Report.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'userName displayName avatarUrl email');

        res.status(200).json({
            success: true,
            reports,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error("Lỗi trong getReports:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

/**
 * Dịyệt qua báo cáo (false positive) - cập nhật status báo cáo
 * PATCH /api/admin/reports/:id/approve
 */
export const approveReport = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ" });
        }

        const report = await Report.findByIdAndUpdate(
            id,
            { status: 'Approved' },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ success: false, message: "Không tìm thấy báo cáo" });
        }

        // === Xử lý Comment đang chờ duyệt ===
        if (report.contentType === 'Comment' && report.originalData && report.originalData.commentId) {
            const Comment = (await import('../models/Comment.js')).default;
            
            await Comment.findByIdAndUpdate(report.originalData.commentId, { moderationStatus: 'visible' });
            
            const resolvedComment = await Comment.findById(report.originalData.commentId)
                .populate('userId', 'userName displayName avatarUrl');
            if (resolvedComment) {
                io.to(`room_question_${resolvedComment.targetId}`).emit('new_comment', resolvedComment);
            }

            // Gửi thông báo cho chủ bình luận
            await createNotification({
                receiverId: report.userId,
                senderId: req.user._id,
                targetId: report.originalData.commentId,
                targetType: 'Comment',
                type: 'approved',
                message: 'Bình luận của bạn đã được Kiểm duyệt và hiển thị thành công.',
                link: `/questions/${report.originalData.targetId}`,
            });
        }

        // === Xử lý Question đang chờ duyệt (status: 'pending') ===
        if (report.contentType === 'Question' && report.originalData) {
            const Tag = (await import('../models/Tag.js')).default;

            // Tìm câu hỏi pending đã được tạo trước đó (theo originalData.questionId hoặc tìm qua report.userId + status pending)
            const QuestionData = (await import('../models/Question.js')).default;
            let targetQuestion = report.originalData.questionId
                ? await QuestionData.findById(report.originalData.questionId)
                : null;

            if (targetQuestion && targetQuestion.status === 'pending') {
                // Xử lý tags từ originalData
                const { tags } = report.originalData;
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
                            const newTag = new Tag({ name: tagStr, description: `A tag for ${tagStr}`, totalQuestion: 1 });
                            const savedTag = await newTag.save();
                            tagIds.push(savedTag._id);
                        }
                    }
                }

                targetQuestion.status = 'open';
                targetQuestion.tags = tagIds;
                await targetQuestion.save();

                const populatedQuestion = await QuestionData.findById(targetQuestion._id)
                    .populate('userId', 'userName displayName avatarUrl')
                    .populate('tags', 'name')
                    .populate('lastActivityUser', 'userName displayName avatarUrl');
                io.emit('new_question', populatedQuestion);

                await createNotification({
                    receiverId: report.userId,
                    senderId: req.user._id,
                    targetId: targetQuestion._id,
                    targetType: 'Question',
                    type: 'approved',
                    message: 'Bài đăng của bạn đã được Kiểm duyệt và hiển thị thành công.',
                    link: `/questions/${targetQuestion._id}`,
                });
            } else {
                // Fallback: tạo mới (luồng cũ, giũ lại để tương thích)
                const { title, content } = report.originalData;
                const newQuestion = new QuestionData({ userId: report.userId, title, content, lastActivityUser: report.userId });
                await newQuestion.save();
            }
        }

        // === Xử lý Answer đang chờ duyệt ===
        if (report.contentType === 'Answer' && report.originalData) {
            const { content, quesId } = report.originalData;
            if (quesId) {
                const AnswerData = (await import('../models/Answer.js')).default;
                const QuestionData = (await import('../models/Question.js')).default;
                
                const newAnswer = new AnswerData({ quesId, userId: report.userId, content });
                await newAnswer.save();

                const question = await QuestionData.findById(quesId);
                if (question) {
                    question.answersCount += 1;
                    question.lastActivityAt = new Date();
                    question.lastActivityUser = report.userId;
                    await question.save();
                }

                await createNotification({
                    receiverId: report.userId,
                    senderId: req.user._id,
                    targetId: newAnswer._id,
                    targetType: 'Answer',
                    type: 'approved',
                    message: 'Câu trả lời của bạn đã được Kiểm duyệt và hiển thị thành công.',
                    link: `/questions/${quesId}`,
                });
            }
        }

        io.emit('report_processed', report);

        res.status(200).json({
            success: true,
            message: "Đã duyệt qua báo cáo (False Positive)",
            report
        });
    } catch (error) {
        console.error("Lỗi trong approveReport:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};


/**
 * Từ chối và xóa báo cáo (xác nhận vi phạm)
 * DELETE /api/admin/reports/:id/reject
 */
export const rejectReport = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ" });
        }

        const report = await Report.findByIdAndUpdate(
            id,
            { status: 'Rejected' },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ success: false, message: "Không tìm thấy báo cáo" });
        }

        // Xác định ID nội dung cần xóa (hỗ trợ cả auto-moderation và user report)
        const targetContentId = report.originalData?.targetId 
            || report.originalData?.commentId 
            || report.originalData?.questionId;

        // Xác định chủ nội dung bị báo cáo
        const contentOwnerId = report.originalData?.contentOwnerId || report.userId;

        // === Xóa Comment vi phạm ===
        if (report.contentType === 'Comment' && targetContentId) {
            const Comment = (await import('../models/Comment.js')).default;
            await Comment.findByIdAndDelete(targetContentId);
        }

        // === Xóa Question vi phạm ===
        if (report.contentType === 'Question' && targetContentId) {
            const QuestionData = (await import('../models/Question.js')).default;
            const AnswerData = (await import('../models/Answer.js')).default;
            const CommentModel = (await import('../models/Comment.js')).default;
            const VoteModel = (await import('../models/Vote.js')).default;

            // Xóa answers, comments, votes liên quan
            const answers = await AnswerData.find({ quesId: targetContentId }).select('_id');
            const answerIds = answers.map(a => a._id);
            await VoteModel.deleteMany({ targetType: "Answer", ansId: { $in: answerIds } });
            await CommentModel.deleteMany({ targetType: "Answer", targetId: { $in: answerIds } });
            await AnswerData.deleteMany({ quesId: targetContentId });
            await CommentModel.deleteMany({ targetType: "Question", targetId: targetContentId });
            await VoteModel.deleteMany({ targetType: "Question", quesId: targetContentId });
            await QuestionData.findByIdAndDelete(targetContentId);
        }

        // === Xóa Answer vi phạm ===
        if (report.contentType === 'Answer' && targetContentId) {
            const AnswerData = (await import('../models/Answer.js')).default;
            const CommentModel = (await import('../models/Comment.js')).default;
            const VoteModel = (await import('../models/Vote.js')).default;
            const QuestionData = (await import('../models/Question.js')).default;

            const answer = await AnswerData.findById(targetContentId);
            if (answer) {
                // Giảm answersCount của câu hỏi
                await QuestionData.findByIdAndUpdate(answer.quesId, { $inc: { answersCount: -1 } });
                await VoteModel.deleteMany({ targetType: "Answer", ansId: targetContentId });
                await CommentModel.deleteMany({ targetType: "Answer", targetId: targetContentId });
                await AnswerData.findByIdAndDelete(targetContentId);
            }
        }

        // Gửi thông báo từ chối cho chủ nội dung bị báo cáo
        const contentTypeMap = { Question: 'Bài đăng', Comment: 'Bình luận', Answer: 'Câu trả lời' };
        const contentLabel = contentTypeMap[report.contentType] || 'Nội dung';
        await createNotification({
            receiverId: contentOwnerId,
            senderId: req.user._id,
            targetId: report._id,
            targetType: report.contentType,
            type: 'rejected',
            message: `${contentLabel} của bạn đã bị xóa do vi phạm Nội quy cộng đồng.`,
        });

        io.emit('report_processed', report);

        res.status(200).json({
            success: true,
            message: "Đã từ chối và xóa nội dung vi phạm",
            report
        });
    } catch (error) {
        console.error("Lỗi trong rejectReport:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};


/**
 * Xóa báo cáo + nội dung gốc (nếu có)
 * DELETE /api/admin/reports/:id
 */
export const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ" });
        }

        await Report.findByIdAndDelete(id);

        io.emit('report_processed', { _id: id, deleted: true });

        res.status(200).json({
            success: true,
            message: "Đã xóa báo cáo"
        });
    } catch (error) {
        console.error("Lỗi trong deleteReport:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};
