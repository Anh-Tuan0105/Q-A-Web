import mongoose from "mongoose";

const profileViewSchema = mongoose.Schema({
    viewerId: {
        type: String, // User ID if logged in, otherwise IP address
        required: true,
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    viewedAt: {
        type: Date,
        default: Date.now,
        index: { expires: '24h' } // Optional: allow re-viewing after 24 hours
    }
});

// Compound index to ensure unique view per viewer per profile within the expiry period
profileViewSchema.index({ viewerId: 1, profileId: 1 }, { unique: true });

const ProfileView = mongoose.model("ProfileView", profileViewSchema);

export default ProfileView;
