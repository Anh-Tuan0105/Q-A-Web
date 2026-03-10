import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const socketMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            // Cho phép kết nối dưới dạng khách (guest) nếu không có token
            return next();
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedPayload) => {
            if (err) {
                console.log("Socket token verify error:", err.message);
                return next(); // Vẫn cho phép kết nối nhưng không gán user, coi như khách
            }

            const user = await User.findById(decodedPayload.userId).select('-hashedPassword');

            if (!user) {
                return next(new Error("User not found"));
            }

            socket.user = user; // Gán thông tin user vào socket object

            next();
        });
    } catch (error) {
        console.log("Socket middleware error:", error);
        next();
    }
};
