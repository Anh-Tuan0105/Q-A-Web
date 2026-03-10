import Notification from "../models/Notification.js";
import mongoose from "mongoose";

// Lấy danh sách thông báo của người dùng hiện tại
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ receiverId: userId })
            .sort({ createdAt: -1 })
            .populate("senderId", "userName displayName avatarUrl"); // Lấy thông tin người gửi

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error("Lỗi trong getNotifications:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

// Đánh dấu 1 thông báo là đã đọc
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID thông báo không hợp lệ" });
        }

        const notification = await Notification.findOneAndUpdate(
            { _id: id, receiverId: userId }, // Đảm bảo chỉ người nhận mới được cập nhật
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông báo hoặc bạn không có quyền" });
        }

        res.status(200).json({
            success: true,
            message: "Đã đánh dấu thông báo là đã đọc",
            notification,
        });
    } catch (error) {
        console.error("Lỗi trong markAsRead:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

// Đánh dấu tất cả thông báo là đã đọc
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.updateMany(
            { receiverId: userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: "Đã đánh dấu tất cả thông báo là đã đọc",
        });
    } catch (error) {
        console.error("Lỗi trong markAllAsRead:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};
