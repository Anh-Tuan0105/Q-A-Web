import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
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
            if (parsedSocialLinks.linkedin !== undefined) updateFields.socialLinks.linkedin = parsedSocialLinks.linkedin;
        }

        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            
            const currentUser = await User.findById(userId);
            if (currentUser && currentUser.avatarId) {
                try {
                    await cloudinary.uploader.destroy(currentUser.avatarId);
                } catch (err) {
                    console.log("Failed to destroy old avatar:", err);
                }
            }

            const result = await cloudinary.uploader.upload(dataURI, { folder: "avatars" });
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
