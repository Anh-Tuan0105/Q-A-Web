import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protectedRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const accessToken = authHeader && authHeader.split(" ")[1];

        if (!accessToken) {
            return res.status(401).json({ message: "Access Token không tồn tại hoặc hết hạn" })
        }

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decodedPayload) => {
            if (err) {
                console.log(err)
                return res.status(403).json({ message: "Access Token hết hạn hoặc không tồn tại" })
            }

            const user = await User.findById(decodedPayload.userId).select('-hashedPassword');

            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại hoặc đã đăng xuất" })
            }

            if (user.isBanned) {
                return res.status(403).json({ message: "Tài khoản của bạn đã bị cấm." });
            }

            req["user"] = user;
            next();
        });

    } catch (error) {
        console.log("Lỗi khi xác minh jwt", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const accessToken = authHeader && authHeader.split(" ")[1];

        if (!accessToken) {
            return next();
        }

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decodedPayload) => {
            if (err) {
                return next();
            }

            const user = await User.findById(decodedPayload.userId).select('-hashedPassword');
            if (user) {
                req["user"] = user;
            }
            next();
        });
    } catch (error) {
        next();
    }
}

// Middleware kiểm tra quyền admin
export const adminOnly = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Bạn không có quyền truy cập. Chỉ dành cho quản trị viên." });
    }
    next();
}