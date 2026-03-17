import User from "../models/User.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import ProfileView from "../models/ProfileView.js";
import mongoose from "mongoose";
import { io } from "../lib/socket.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";

export const authMe = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json(user);

    } catch (error) {
        console.log("Lỗi khi gọi authMe", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const test = async (req, res) => {
    return res.sendStatus(204);
}

// Lấy thông tin chi tiết của một user (cho trang Profile)
export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { sort = "votes" } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID User không hợp lệ" });
        }

        const user = await User.findById(id).select("-hashedPassword");

        if (!user) {
            return res.status(404).json({ success: false, message: "User không tồn tại" });
        }

        // Đếm tổng số câu hỏi và thống kê view của user đó
        const questionStats = await Question.aggregate([
            { $match: { userId: user._id } },
            {
                $group: {
                    _id: null,
                    totalQuestions: { $sum: 1 },
                    totalQuestionViews: { $sum: "$viewCount" },
                    totalQuestionUpvotes: { $sum: "$upvoteCount" }
                }
            }
        ]);

        // Đếm tổng số câu trả lời và số upvote/downvote
        const answerStats = await Answer.aggregate([
            { $match: { userId: user._id } },
            {
                $group: {
                    _id: null,
                    totalAnswers: { $sum: 1 },
                    totalAnswerUpvotes: { $sum: "$upvoteCount" },
                    totalAnswerDownvotes: { $sum: "$downvoteCount" }
                }
            }
        ]);

        const qt = questionStats[0] || { totalQuestions: 0, totalQuestionViews: 0, totalQuestionUpvotes: 0 };
        const at = answerStats[0] || { totalAnswers: 0, totalAnswerUpvotes: 0, totalAnswerDownvotes: 0 };

        // 1. Top 3 Câu hỏi (sắp xếp theo điểm, rồi câu trả lời, rồi views)
        const topQuestions = await Question.find({ userId: user._id })
            .sort({ upvoteCount: -1, answersCount: -1, viewCount: -1 })
            .limit(3)
            .populate("tags", "name")
            .select("title viewCount upvoteCount downvoteCount answersCount status tags");

        let sortQueryAnswers = { upvoteCount: -1 };
        if (sort === "votes") {
            sortQueryAnswers = { isAccepted: -1, upvoteCount: -1 };
        }
        const topAnswers = await Answer.find({ userId: user._id })
            .sort(sortQueryAnswers)
            .limit(3)
            .populate({
                path: "quesId",
                select: "title tags",
                populate: {
                    path: "tags",
                    select: "name"
                }
            })
            .select("content upvoteCount downvoteCount createdAt isAccepted")

        // 3. Top Tags (Dựa trên tổng điểm câu trả lời của user này ở mỗi Tag)
        // Vì Answer có `quesId`, và Question có mảng `tags`.
        const topTagsAgg = await Answer.aggregate([
            { $match: { userId: user._id } },
            {
                $lookup: {
                    from: "questions", // collection name in db
                    localField: "quesId",
                    foreignField: "_id",
                    as: "question"
                }
            },
            { $unwind: "$question" },
            { $unwind: "$question.tags" },
            {
                $group: {
                    _id: "$question.tags", // group by Tag ID
                    score: { $sum: { $subtract: ["$upvoteCount", "$downvoteCount"] } },
                    answersCount: { $sum: 1 }
                }
            },
            { $sort: { score: -1 } },
            { $limit: 4 },
            {
                $lookup: {
                    from: "tags",
                    localField: "_id",
                    foreignField: "_id",
                    as: "tagInfo"
                }
            },
            { $unwind: "$tagInfo" },
            {
                $project: {
                    _id: "$tagInfo._id",
                    name: "$tagInfo.name",
                    score: 1,
                    answersCount: 1
                }
            }
        ]);


        res.status(200).json({
            success: true,
            user,
            stats: {
                totalQuestions: qt.totalQuestions,
                totalAnswers: at.totalAnswers,
                totalViews: qt.totalQuestionViews, 
                reputation: user.reputation, // Sử dụng trường reputation từ database
            },
            topQuestions,
            topAnswers,
            topTags: topTagsAgg
        });

    } catch (error) {
        console.error("Lỗi get profile data:", error);
        res.status(500).json({ success: false, message: "Lỗi Server", error: error.message });
    }
};

// API tăng profile view (Chỉ tăng khi người khác xem và là duy nhất trong 24h)
export const incrementProfileView = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID User không hợp lệ" });
        }

        const currentUserId = req.user ? req.user._id.toString() : null;
        const viewerId = currentUserId || req.ip; // Dùng UserID nếu có, không thì dùng IP

        if (currentUserId === id) {
            return res.status(200).json({ success: true, message: "Tự xem trang của mình, không đếm." });
        }

        // Kiểm tra xem đã xem chưa
        const existingView = await ProfileView.findOne({ viewerId, profileId: id });

        if (existingView) {
            // Đã xem rồi, chỉ trả về số view hiện tại
            const user = await User.findById(id).select("profileViews");
            return res.status(200).json({ success: true, profileViews: user.profileViews, alreadyViewed: true });
        }

        // Chưa xem, tạo record mới và tăng view
        await ProfileView.create({ viewerId, profileId: id });

        const user = await User.findByIdAndUpdate(
            id,
            { $inc: { profileViews: 1 } },
            { new: true }
        ).select("profileViews");

        if (!user) {
            return res.status(404).json({ success: false, message: "User không tồn tại" });
        }

        // Emit socket event to notify other users viewing this profile
        io.to(`user_${id}`).emit("profile_view_updated", {
            profileId: id,
            profileViews: user.profileViews
        });

        res.status(200).json({ success: true, profileViews: user.profileViews });

    } catch (error) {
        console.error("Lỗi khi increment profile view:", error);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};

// Lấy danh sách câu hỏi của user có phân trang và sắp xếp
export const getUserQuestions = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10, sort = "newest" } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID User không hợp lệ" });
        }

        let sortQuery = { createdAt: -1 };
        if (sort === "votes") {
            sortQuery = { upvoteCount: -1, createdAt: -1 };
        }

        const skip = (page - 1) * limit;

        const questions = await Question.find({ userId: id })
            .sort(sortQuery)
            .skip(skip)
            .limit(parseInt(limit))
            .populate("tags", "name")
            .select("title viewCount upvoteCount downvoteCount answersCount status tags createdAt");

        const totalItems = await Question.countDocuments({ userId: id });

        res.status(200).json({
            success: true,
            data: questions,
            pagination: {
                totalItems,
                currentPage: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalItems / limit)
            }
        });

    } catch (error) {
        console.error("Lỗi get user questions:", error);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};

// Lấy danh sách câu trả lời của user có phân trang và sắp xếp
export const getUserAnswers = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10, sort = "newest" } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID User không hợp lệ" });
        }

        let sortQuery = { createdAt: -1 };
        if (sort === "votes") {
            sortQuery = { isAccepted: -1, upvoteCount: -1, createdAt: -1 };
        }

        const skip = (page - 1) * limit;

        const answers = await Answer.find({ userId: id })
            .sort(sortQuery)
            .skip(skip)
            .limit(parseInt(limit))
            .populate({
                path: "quesId",
                select: "title tags",
                populate: {
                    path: "tags",
                    select: "name"
                }
            })
            .select("content upvoteCount downvoteCount createdAt isAccepted quesId");

        const totalItems = await Answer.countDocuments({ userId: id });

        res.status(200).json({
            success: true,
            data: answers,
            pagination: {
                totalItems,
                currentPage: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalItems / limit)
            }
        });

    } catch (error) {
        console.error("Lỗi get user answers:", error);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { displayName, jobTitle, bio, location, websitePersonal, socialLinks, avatarUrl, avatarId } = req.body;

        if (bio && bio.length > 500) {
            return res.status(400).json({ message: "Giới thiệu ngắn (bio) không được vượt quá 500 ký tự" });
        }

        const updateFields = {};
        if (displayName !== undefined) updateFields.displayName = displayName;
        if (jobTitle !== undefined) updateFields.jobTitle = jobTitle;
        if (bio !== undefined) updateFields.bio = bio;
        if (location !== undefined) updateFields.location = location;
        if (websitePersonal !== undefined) updateFields.websitePersonal = websitePersonal;

        // Handle socialLinks if it's stringified from FormData
        let parsedSocialLinks = socialLinks;
        if (typeof socialLinks === 'string') {
            try {
                parsedSocialLinks = JSON.parse(socialLinks);
            } catch (e) {
                parsedSocialLinks = null;
            }
        }

        if (parsedSocialLinks) {
            updateFields.socialLinks = {};
            if (parsedSocialLinks.github !== undefined) updateFields.socialLinks.github = parsedSocialLinks.github;
            if (parsedSocialLinks.facebook !== undefined) updateFields.socialLinks.facebook = parsedSocialLinks.facebook;
        }

        if (req.file) {
            const currentUser = await User.findById(userId);
            if (currentUser && currentUser.avatarId) {
                try {
                    await cloudinary.uploader.destroy(currentUser.avatarId);
                } catch (err) {
                    console.log("Failed to destroy old avatar:", err);
                }
            }

            const result = await uploadImageFromBuffer(req.file.buffer);
            updateFields.avatarUrl = result.secure_url;
            updateFields.avatarId = result.public_id;
        } else {
            if (avatarUrl !== undefined) {
                updateFields.avatarUrl = avatarUrl;
                // Người dùng nhấn "Xóa ảnh" (xóa avatar)
                if (avatarUrl === "") {
                    const currentUser = await User.findById(userId);
                    if (currentUser && currentUser.avatarId) {
                        try {
                            await cloudinary.uploader.destroy(currentUser.avatarId);
                        } catch (err) {
                            console.log("Failed to destroy old avatar:", err);
                        }
                    }
                    updateFields.avatarId = "";
                }
            }
            if (avatarId !== undefined) updateFields.avatarId = avatarId;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select("-hashedPassword");

        if (!updatedUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        return res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Lỗi khi gọi updateProfile", error);
        return res.status(500).json({ message: "Lỗi hệ thống khi cập nhật hồ sơ" });
    }
}

// Lấy danh sách thành viên có phân trang, tìm kiếm và sắp xếp
export const getMembers = async (req, res) => {
    try {
        const { page = 1, limit = 8, keyword = "", sort = "reputation" } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const query = {};

        if (keyword) {
            query.$or = [
                { displayName: { $regex: keyword, $options: "i" } },
                { userName: { $regex: keyword, $options: "i" } }
            ];
        }

        let sortQuery = { reputation: -1, createdAt: -1 };
        if (sort === "newest") {
            sortQuery = { createdAt: -1 };
        }

        const users = await User.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(parseInt(limit))
            .select("displayName userName avatarUrl reputation bio jobTitle location createdAt socialLinks");

        const usersWithEnhancedData = await Promise.all(users.map(async (user) => {
            // 2. Đếm tổng bài viết (Questions + Answers) - Vẫn giữ lại vì ko có trong DB field
            const postCount = await Question.countDocuments({ userId: user._id });
            const answerCount = await Answer.countDocuments({ userId: user._id });

            // 3. Lấy Top 3 Tags mà user hay trả lời nhất
            const topTags = await Answer.aggregate([
                { $match: { userId: user._id } },
                {
                    $lookup: {
                        from: "questions",
                        localField: "quesId",
                        foreignField: "_id",
                        as: "question"
                    }
                },
                { $unwind: "$question" },
                { $unwind: "$question.tags" },
                {
                    $group: {
                        _id: "$question.tags",
                        score: { $sum: { $subtract: ["$upvoteCount", "$downvoteCount"] } }
                    }
                },
                { $sort: { score: -1 } },
                { $limit: 3 },
                {
                    $lookup: {
                        from: "tags",
                        localField: "_id",
                        foreignField: "_id",
                        as: "tagInfo"
                    }
                },
                { $unwind: "$tagInfo" },
                {
                    $project: {
                        _id: 1,
                        name: "$tagInfo.name",
                        score: 1
                    }
                }
            ]);

            return {
                ...user._doc,
                // reputation đã có sẵn trong user._doc vì được select ở trên
                postCount: postCount + answerCount,
                topTags: topTags
            };
        }));

        const totalItems = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: usersWithEnhancedData,
            pagination: {
                totalItems,
                currentPage: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalItems / parseInt(limit))
            }
        });

    } catch (error) {
        console.error("Lỗi get members:", error);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};
// --- ADMIN FUNCTIONS ---

// Lấy danh sách tất cả người dùng (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-hashedPassword").sort({ createdAt: -1 });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// Cấm người dùng (Admin only)
export const banUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: "Không thể cấm tài khoản Admin" });
        }

        user.isBanned = true;
        await user.save();

        // Gửi sự kiện realtime để "đá" người dùng ra ngoài
        io.to(`user_${id}`).emit("user_banned");

        return res.status(200).json({ message: "Đã cấm người dùng thành công", user });
    } catch (error) {
        console.error("Lỗi khi ban user:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// Bỏ cấm người dùng (Admin only)
export const unbanUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        user.isBanned = false;
        await user.save();

        return res.status(200).json({ message: "Đã bỏ cấm người dùng thành công", user });
    } catch (error) {
        console.error("Lỗi khi unban user:", error);
    }
};

// Cập nhật điểm uy tín (Admin only)
export const updateReputation = async (req, res) => {
    try {
        const { id } = req.params;
        const { reputation } = req.body;

        if (reputation === undefined || typeof reputation !== 'number') {
            return res.status(400).json({ message: "Điểm uy tín không hợp lệ" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        user.reputation = reputation;
        await user.save();

        return res.status(200).json({ message: "Cập nhật điểm uy tín thành công", reputation: user.reputation });
    } catch (error) {
        console.error("Lỗi khi cập nhật reputation:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
