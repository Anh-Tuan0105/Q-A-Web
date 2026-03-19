import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    content: {
        title: { type: String },
        body: { type: String, required: true }
    },
    contentType: { 
        type: String, 
        enum: ['Question', 'Answer', 'Comment'],
        required: true 
    },
    reason: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    originalData: { 
        type: Object 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
