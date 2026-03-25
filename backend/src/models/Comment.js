import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
    {
        // Hỗ trợ comment cho cả Question và Answer
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        targetType: {
            type: String,
            enum: ['Question', 'Answer'],
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            maxLength: 600,
        },
        // Trạng thái kiểm duyệt bất đồng bộ
        // 'visible'        → Hiện bình thường
        // 'pending_ai'     → Chờ AI check (chưa xử lý)
        // 'hidden'         → AI phát hiện vi phạm, đã ẩn
        // 'pending_review' → Bị gắn cờ (blacklist/AI), đang chờ Admin xem xét
        moderationStatus: {
            type: String,
            enum: ['visible', 'pending_ai', 'hidden', 'pending_review'],
            default: 'pending_ai',
        },
    },
    {
        timestamps: true,
    }
);

commentSchema.index({ targetId: 1, targetType: 1, createdAt: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ moderationStatus: 1 });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
