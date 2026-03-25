import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
    {
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            // ID của Question, Answer, Vote, v.v. tùy thuộc vào targetType
        },
        targetType: {
            type: String,
            required: true,
            enum: ["Question", "Answer", "Vote", "Comment"],
        },
        type: {
            type: String,
            enum: ["new_comment", "new_answer", "vote", "approved", "rejected"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        link: {
            type: String, // Hữu ích cho frontend để điều hướng người dùng sau khi click
        },
    },
    {
        timestamps: true,
    }
);

// --- Các Index để tối ưu hóa truy vấn ---
// Truy vấn phổ biến nhất: Lấy thông báo cho một người dùng cụ thể, sắp xếp mới nhất lên đầu
notificationSchema.index({ receiverId: 1, createdAt: -1 });
// Truy vấn để đếm/tìm nhanh các thông báo chưa đọc
notificationSchema.index({ receiverId: 1, isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
