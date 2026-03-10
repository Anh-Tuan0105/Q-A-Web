import mongoose from "mongoose";

const tagSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            maxlength: 50,
        },
        description: {
            type: String,
            required: true,
            maxlength: 500,
        },
        totalQuestion: {
            type: Number,
            default: 0,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// --- Các Index để tối ưu hóa truy vấn ---
// Sắp xếp các tag theo độ phổ biến (số lượng câu hỏi)
tagSchema.index({ totalQuestion: -1 });

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
