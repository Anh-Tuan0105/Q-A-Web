import Notification from "../models/Notification.js";
import { io } from "../lib/socket.js";

/**
 * Tạo thông báo và emit realtime qua Socket.io
 * @param {object} options
 * @param {string} options.receiverId - ID người nhận thông báo
 * @param {string} options.senderId  - ID người gửi (dùng "system" hoặc adminId)
 * @param {string} options.targetId  - ID đối tượng liên quan (bài đăng, bình luận...)
 * @param {string} options.targetType - Loại đối tượng
 * @param {string} options.type      - Loại thông báo (new_comment, approved, rejected, ...)
 * @param {string} options.message   - Nội dung thông báo
 * @param {string} [options.link]    - Đường dẫn điều hướng (tùy chọn)
 */
export const createNotification = async ({
    receiverId,
    senderId,
    targetId,
    targetType,
    type,
    message,
    link,
}) => {
    try {
        const notification = await Notification.create({
            receiverId,
            senderId,
            targetId,
            targetType,
            type,
            message,
            link,
        });

        // Emit realtime tới đúng user
        io.to(`user_${receiverId}`).emit("new_notification", notification);

        return notification;
    } catch (err) {
        console.error("Lỗi khi tạo thông báo:", err.message);
    }
};
