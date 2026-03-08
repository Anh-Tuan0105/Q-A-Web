import mongoose from "mongoose";

// Lưu ý: Trong MongoDB, mối quan hệ Nhiều-Nhiều (Many-to-Many) thường được xử lý tốt hơn
// bằng cách nhúng một mảng các ObjectId trong các model (như mảng `tags` trong Question.js).
// Tuy nhiên, để khớp với schema giống SQL được cung cấp:
const questionTagSchema = mongoose.Schema(
    {
        tagId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag",
            required: true,
        },
        quesId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Ngăn chặn việc gán trùng lặp một tag cho cùng một câu hỏi
questionTagSchema.index({ tagId: 1, quesId: 1 }, { unique: true });

const QuestionTag = mongoose.model("QuestionTag", questionTagSchema);

export default QuestionTag;
