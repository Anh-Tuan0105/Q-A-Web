import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import Session from '../models/Session.js';
import crypto from 'crypto'


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
            return res.status(409).json({ message: "Tài khoản hoặc mật khẩu bị sai" });
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
        console.log("Lỗi khi gọi refreshToken", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

