import mongoose from "mongoose";

const voteSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        quesId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            // Bắt buộc nếu vote cho một Question, vì vậy không nên để required ở mức global
        },
        ansId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer",
            // Bắt buộc nếu vote cho một Answer, vì vậy không nên để required ở mức global
        },
        value: {
            type: Number,
            required: true,
            enum: [1, -1], // 1 cho Upvote, -1 cho Downvote
        },
        targetType: {
            type: String,
            required: true,
            enum: ["Question", "Answer"], // Phân biệt đối tượng đang được vote là gì
        },
    },
    {
        timestamps: true,
    }
);

// Đảm bảo một người dùng chỉ có thể vote một lần cho mỗi đối tượng (một Answer hoặc một Question cụ thể)
voteSchema.index(
    { userId: 1, targetType: 1, quesId: 1, ansId: 1 },
    { unique: true }
);

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
