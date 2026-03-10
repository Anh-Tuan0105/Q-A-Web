import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
    },
    avatarUrl: {
        type: String,
    },
    avatarId: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    jobTitle: {
        type: String,
    },
    location: {
        type: String,
    },
    websitePersonal: {
        type: String,
    },
    socialLinks: {
        type: [String],
    },
    reputation: {
        type: Number,
        default: 0,
    },
    profileViews: {
        type: Number,
        default: 0,
    },
},
    {
        timestamps: true,
    });

const User = mongoose.model("User", userSchema);

export default User;