import Comment from "../models/Comment.js";
import Report from "../models/Report.js";
import mongoose from "mongoose";
import { io } from "../lib/socket.js";
import { checkBlacklist } from "../helpers/vi-blacklist.js";
import { moderateWithGemini } from "../services/ai.service.js";
import { createNotification } from "../services/notification.service.js";

const MODERATION_PENDING_MSG =
    "Bình luận của bạn có nội dung cần được xem xét thêm trước khi hiển thị. Chúng tôi sẽ thông báo kết quả cho bạn sớm nhất.";

/**
 * Tạo comment mới
 * POST /api/comments/:targetType/:targetId
 */
export const createComment = async (req, res) => {
    try {
        const { targetType, targetId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        if (!['Question', 'Answer'].includes(targetType)) {
            return res.status(400).json({ success: false, message: "Loại mục tiêu không hợp lệ" });
        }

        if (!mongoose.Types.ObjectId.isValid(targetId)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ" });
        }

        if (!content?.trim()) {
            return res.status(400).json({ success: false, message: "Nội dung bình luận không được để trống" });
        }

        if (content.length > 600) {
            return res.status(400).json({ success: false, message: "Bình luận tối đa 600 ký tự" });
        }

        // === LỚP 1: Blacklist - kiểm tra đồng bộ, nhanh ===
        const blacklistViolation = checkBlacklist(content);
        if (blacklistViolation) {
            const flaggedComment = new Comment({
                targetId, targetType, userId,
                content: content.trim(),
                moderationStatus: 'pending_review',
            });
            await flaggedComment.save();

            await Report.create({
                content: { body: content },
                contentType: 'Comment',
                reason: `Blacklist: chứa từ "${blacklistViolation}"`,
                userId,
                originalData: { commentId: flaggedComment._id, targetId, targetType }
            });

            // Gửi thông báo hệ thống
            await createNotification({
                receiverId: userId,
                senderId: userId,
                targetId: flaggedComment._id,
                targetType: 'Comment',
                type: 'rejected',
                message: "Bình luận của bạn đang chờ quản trị viên phê duyệt."
            });

            return res.status(202).json({
                success: true,
                pending: true,
                message: MODERATION_PENDING_MSG,
            });
        }

        // === LỚP 2: Gemini AI - kiểm tra đồng bộ ===
        let aiViolation = false;
        let aiReason = '';
        try {
            const aiResult = await moderateWithGemini(content);
            if (!aiResult.isSafe) {
                aiViolation = true;
                aiReason = aiResult.reason;
            }
        } catch (err) {
            // Nếu AI lỗi → cho comment đi qua bình thường
            console.error("Async AI moderation error:", err.message);
        }

        if (aiViolation) {
            const flaggedComment = new Comment({
                targetId, targetType, userId,
                content: content.trim(),
                moderationStatus: 'pending_review',
            });
            await flaggedComment.save();

            await Report.create({
                content: { body: content },
                contentType: 'Comment',
                reason: `AI Detection: ${aiReason}`,
                userId,
                originalData: { commentId: flaggedComment._id, targetId, targetType }
            });

            // Gửi thông báo hệ thống
            await createNotification({
                receiverId: userId,
                senderId: userId,
                targetId: flaggedComment._id,
                targetType: 'Comment',
                type: 'rejected',
                message: "Bình luận của bạn đang chờ quản trị viên phê duyệt."
            });

            return res.status(202).json({
                success: true,
                pending: true,
                message: MODERATION_PENDING_MSG,
            });
        }

        // === Nội dung sạch → lưu và phát realtime ===
        const newComment = new Comment({
            targetId, targetType, userId,
            content: content.trim(),
            moderationStatus: 'visible',
        });

        await newComment.save();

        const populatedComment = await Comment.findById(newComment._id)
            .populate('userId', 'userName displayName avatarUrl');

        // Phát sóng realtime cho người đang xem
        io.to(`room_question_${targetId}`).emit('new_comment', populatedComment);

        res.status(201).json({
            success: true,
            message: "Đã đăng bình luận",
            comment: populatedComment
        });

    } catch (error) {
        console.error("Lỗi trong createComment:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};


/**
 * Lấy danh sách comment theo target
 * GET /api/comments/:targetType/:targetId
 * Chỉ lấy comment visible hoặc pending_ai (loại bỏ hidden)
 */
export const getComments = async (req, res) => {
    try {
        const { targetType, targetId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(targetId)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ" });
        }

        const comments = await Comment.find({
            targetId,
            targetType,
            moderationStatus: { $in: ['visible', 'pending_ai'] }
        })
            .sort({ createdAt: 1 })
            .populate('userId', 'userName displayName avatarUrl');

        res.status(200).json({ success: true, comments });
    } catch (error) {
        console.error("Lỗi trong getComments:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

/**
 * Xóa comment
 * DELETE /api/comments/:id
 */
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ" });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bình luận" });
        }

        if (comment.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Bạn không có quyền xóa bình luận này" });
        }

        await Comment.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Đã xóa bình luận" });
    } catch (error) {
        console.error("Lỗi trong deleteComment:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

/**
 * Cập nhật comment (sửa bình luận)
 * PUT /api/comments/:id
 */
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ" });
        }

        if (!content?.trim()) {
            return res.status(400).json({ success: false, message: "Nội dung bình luận không được để trống" });
        }

        if (content.length > 600) {
            return res.status(400).json({ success: false, message: "Bình luận tối đa 600 ký tự" });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bình luận" });
        }

        if (comment.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Bạn không có quyền sửa bình luận này" });
        }

        comment.content = content.trim();
        // Optional: Could reset moderation status here if we wanted to re-moderate edits
        await comment.save();

        const populatedComment = await Comment.findById(comment._id)
            .populate('userId', 'userName displayName avatarUrl');

        res.status(200).json({ success: true, message: "Đã cập nhật bình luận", comment: populatedComment });
    } catch (error) {
        console.error("Lỗi trong updateComment:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};
