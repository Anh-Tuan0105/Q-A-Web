import mongoose from "mongoose";

const questionSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        content: {
            type: String,
            required: true,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
        lastActivityAt: {
            type: Date,
            default: Date.now,
        },
        lastActivityUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        // --- Thêm vào cho logic Q&A ---
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tag",
            },
        ],
        upvoteCount: {
            type: Number,
            default: 0,
        },
        downvoteCount: {
            type: Number,
            default: 0,
        },
        answersCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["open", "closed", "resolved"],
            default: "open",
        },
    },
    {
        timestamps: true,
    }
);

// --- Các Index để tối ưu hóa truy vấn ---
// Tìm câu hỏi của một người dùng cụ thể (ví dụ: Trang Profile)
questionSchema.index({ userId: 1 });
// Tìm các câu hỏi mới nhất hoặc sắp xếp theo hoạt động
questionSchema.index({ createdAt: -1 });
questionSchema.index({ lastActivityAt: -1 });
// Tìm các câu hỏi theo một tag cụ thể
questionSchema.index({ tags: 1 });
// Tìm câu hỏi theo trạng thái (mở/đã giải quyết)
questionSchema.index({ status: 1 });
// Text index hỗ trợ tìm kiếm toàn văn bản theo tiêu đề và nội dung
questionSchema.index({ title: "text", content: "text" });

const Question = mongoose.model("Question", questionSchema);

export default Question;
