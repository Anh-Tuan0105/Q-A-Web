import Report from "../models/Report.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { createNotification } from "../services/notification.service.js";
import { io } from "../lib/socket.js";

/**
 * User tạo report (báo cáo vi phạm của người khác)
 * POST /api/reports
 * Body: { targetId, contentType, reason }
 */
export const createUserReport = async (req, res) => {
    try {
        const { targetId, contentType, reason } = req.body;
        const userId = req.user._id;

        if (!['Question', 'Answer', 'Comment'].includes(contentType)) {
            return res.status(400).json({ success: false, message: "Loại nội dung không hợp lệ" });
        }

        if (!mongoose.Types.ObjectId.isValid(targetId)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ" });
        }

        if (!reason?.trim()) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập lý do báo cáo" });
        }

        // Fetch nội dung gốc và kiểm tra ownership
        let contentBody = '';
        let contentTitle = '';
        let contentOwnerId = null;
        let link = '';

        if (contentType === 'Question') {
            const question = await Question.findById(targetId);
            if (!question) return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi" });
            contentOwnerId = question.userId;
            contentBody = question.content;
            contentTitle = question.title;
            link = `/questions/${question._id}`;
        } else if (contentType === 'Answer') {
            const answer = await Answer.findById(targetId);
            if (!answer) return res.status(404).json({ success: false, message: "Không tìm thấy câu trả lời" });
            contentOwnerId = answer.userId;
            contentBody = answer.content;
            link = `/questions/${answer.quesId}`;
        } else if (contentType === 'Comment') {
            const comment = await Comment.findById(targetId);
            if (!comment) return res.status(404).json({ success: false, message: "Không tìm thấy bình luận" });
            contentOwnerId = comment.userId;
            contentBody = comment.content;
            link = ''; // Comment không có link trực tiếp
        }

        // Không cho phép report chính mình
        if (contentOwnerId.toString() === userId.toString()) {
            return res.status(403).json({ success: false, message: "Bạn không thể báo cáo nội dung của chính mình" });
        }

        // Chặn report trùng lặp
        const existingReport = await Report.findOne({
            userId,
            'originalData.targetId': targetId,
            contentType,
            status: 'Pending'
        });
        if (existingReport) {
            return res.status(409).json({ success: false, message: "Bạn đã báo cáo nội dung này rồi" });
        }

        // Tạo report
        const contentTypeLabel = { Question: 'Câu hỏi', Answer: 'Câu trả lời', Comment: 'Bình luận' };
        const report = new Report({
            content: {
                title: contentTitle || undefined,
                body: contentBody
            },
            contentType,
            reason: reason.trim(),
            userId,
            originalData: {
                targetId,
                contentOwnerId,
                link
            },
            status: 'Pending'
        });
        await report.save();

        // Populate reporter info
        const populatedReport = await Report.findById(report._id)
            .populate('userId', 'userName displayName avatarUrl email');

        // Gửi thông báo cho tất cả admin
        const admins = await User.find({ role: 'admin' }).select('_id');
        for (const admin of admins) {
            await createNotification({
                receiverId: admin._id,
                senderId: userId,
                targetId: report._id,
                targetType: contentType,
                type: 'report',
                message: `Người dùng đã báo cáo một ${contentTypeLabel[contentType]}: "${reason.trim()}"`,
                link: link || undefined,
            });
        }

        // Socket emit cho admin room
        io.emit('new_report', populatedReport);

        res.status(201).json({
            success: true,
            message: "Báo cáo đã được gửi thành công. Cảm ơn bạn!",
            report: populatedReport
        });
    } catch (error) {
        console.error("Lỗi trong createUserReport:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};
