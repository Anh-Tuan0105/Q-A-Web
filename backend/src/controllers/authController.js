import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import Session from '../models/Session.js';
import EmailVerification from '../models/EmailVerification.js';
import crypto from 'crypto'
import { generateOTP } from '../helpers/generateOTP.js';
import { sendMail } from '../helpers/mailSend.js';
import { getOTPTemplate } from '../helpers/otpTemplate.js';


const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req, res) => {
    try {
        //Lấy dữ liệu từ client
        const { username, password, email, firstname, lastname } = req.body;

        // Kiểm tra dữ liệu nhập vào tồn tại không
        if (!username || !password || !email || !firstname || !lastname) {
            return res.status(400).json({ message: "Không thể thiếu username, password, email, firstname, lastname" })
        }

        // Kiểm tra username có tồn tại chưa
        const checkUsername = await User.findOne({ userName: username });
        if (checkUsername) {
            return res.status(409).json({ message: "Tên đăng nhập đã tồn tại" });
        }

        // Kiểm tra email có tồn tại chưa
        const checkEmail = await User.findOne({ email: email });
        if (checkEmail) {
            return res.status(409).json({ message: "Email này đã được sử dụng" });
        }

        // Mã hóa password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        await User.create(
            {
                userName: username,
                hashedPassword: hashedPassword,
                displayName: `${firstname} ${lastname}`,
                email: email
            }
        )

        return res.sendStatus(204);

    } catch (error) {
        console.log("Lỗi khi gọi signUp", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
};

export const signIn = async (req, res) => {
    try {
        // Lấy input
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Thiếu tài khoản hoặc mật khẩu" });
        }

        // Lấy password để so sánh với hashedpassword trong db
        const user = await User.findOne({ userName: username });
        if (!user) {
            return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không tìm thấy" })
        }

        const compare = await bcrypt.compare(password, user.hashedPassword);
        if (!compare) {
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" })
        }

        // tạo access token tham số đầu tiên là cái mà mình muốn lưu ở đây lưu user._id trong payload
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        )

        // tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        await Session.create({
            userId: user._id,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });

        // Lưu refresh token vào cookies
        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: REFRESH_TOKEN_TTL
            }
        )

        return res.status(200).json({
            message: `User ${user.displayName} đã logged in!`,
            accessToken
        });

    } catch (error) {
        console.log("Lỗi khi gọi signIn", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
};

export const logOut = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            await Session.deleteOne({ refreshToken: refreshToken });
        }

        res.clearCookie("refreshToken");

        return res.sendStatus(204);
    } catch (error) {
        console.log("Lỗi khi gọi signUp", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
};

export const refreshToken = async (req, res) => {
    try {
        const oldRefreshToken = req.cookies?.refreshToken;

        if (!oldRefreshToken) {
            return res.status(401).json({ message: "Refresh token không tồn tại" });
        }

        const session = await Session.findOne({ refreshToken: oldRefreshToken });

        if (!session) {
            return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ" });
        }

        if (session.expireAt < new Date()) {
            return res.status(403).json({ message: "Token đã hết hạn" });
        }

        // Tạo access token mới
        const accessToken = jwt.sign(
            { userId: session.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        return res.status(200).json({ accessToken });

    } catch (error) {
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Mật khẩu hiện tại không chính xác" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.hashedPassword = hashedPassword;
        await user.save();

        return res.status(200).json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const requestEmailChange = async (req, res) => {
    try {
        const userId = req.user._id;
        const { newEmail } = req.body;

        if (!newEmail) {
            return res.status(400).json({ message: "Vui lòng nhập địa chỉ email mới" });
        }

        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists && emailExists._id.toString() !== userId.toString()) {
            return res.status(409).json({ message: "Email này đã được sử dụng bởi tài khoản khác" });
        }

        // Tạo mã OTP 6 số ngẫu nhiên từ helper
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 phút

        // Xóa các OTP cũ nếu có
        await EmailVerification.deleteMany({ userId });

        const user = await User.findById(userId);
        const displayName = user?.displayName || user?.userName;

        // Lưu OTP vào DB
        const verification = new EmailVerification({
            userId,
            newEmail,
            otp,
            expiresAt
        });
        await verification.save();

        // Gửi email với template hiện đại
        const emailHtml = getOTPTemplate(otp, displayName);
        await sendMail(newEmail, "[DevCommunity] Xác thực mã OTP đổi email", emailHtml);


        return res.status(200).json({
            success: true,
            message: "Mã xác nhận đã được gửi đến email của bạn",
        });

    } catch (error) {
        console.error("Lỗi khi yêu cầu đổi email:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const verifyEmailChange = async (req, res) => {
    try {
        const userId = req.user._id;
        const { newEmail, otp } = req.body;

        if (!newEmail || !otp) {
            return res.status(400).json({ message: "Vui lòng nhập địa chỉ email mới và mã OTP" });
        }

        // Tìm record chứa OTP chưa hết hạn
        const verificationRecord = await EmailVerification.findOne({
            userId,
            newEmail,
            otp,
            expiresAt: { $gt: new Date() }
        });

        if (!verificationRecord) {
            return res.status(400).json({ message: "Mã OTP không hợp lệ, không đúng email, hoặc đã hết hạn" });
        }

        // OTP đúng, cập nhật email trong User
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        user.email = newEmail;
        await user.save();

        // Xóa record verification sau khi thành công
        await EmailVerification.deleteMany({ userId });

        return res.status(200).json({
            success: true,
            message: "Đổi email thành công",
            user: {
                userName: user.userName,
                email: user.email,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl
            }
        });
    } catch (error) {
        console.error("Lỗi khi xác nhận đổi email:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

// Đăng nhập dành riêng cho Admin
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Thiếu tài khoản hoặc mật khẩu" });
        }

        const user = await User.findOne({ userName: username });
        if (!user) {
            return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
        }

        const compare = await bcrypt.compare(password, user.hashedPassword);
        if (!compare) {
            return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
        }

        // Kiểm tra quyền admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Tài khoản này không có quyền quản trị viên" });
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        const refreshToken = crypto.randomBytes(64).toString('hex');

        await Session.create({
            userId: user._id,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });

        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: REFRESH_TOKEN_TTL
            }
        );

        return res.status(200).json({
            message: `Quản trị viên ${user.displayName} đã đăng nhập!`,
            accessToken
        });

    } catch (error) {
        console.log("Lỗi khi gọi adminLogin", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
