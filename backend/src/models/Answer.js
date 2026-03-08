import mongoose from "mongoose";

const answerSchema = mongoose.Schema(
    {
        quesId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        // --- Thêm vào cho logic Q&A ---
        isAccepted: {
            type: Boolean,
            default: false,
        },
        upvoteCount: {
            type: Number,
            default: 0,
        },
        downvoteCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// --- Các Index để tối ưu hóa truy vấn ---
// Truy vấn phổ biến nhất: Lấy tất cả câu trả lời cho một câu hỏi cụ thể
answerSchema.index({ quesId: 1, createdAt: 1 });
// Tìm câu trả lời bởi một người dùng cụ thể (ví dụ: Trang User Profile)
answerSchema.index({ userId: 1 });
// Tìm nhanh các câu trả lời đã được chấp nhận
answerSchema.index({ isAccepted: 1 });

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
