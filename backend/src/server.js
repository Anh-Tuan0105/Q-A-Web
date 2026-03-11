import { app, server } from "./lib/socket.js";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import questionRoute from './routes/questionRoute.js'
import answerRoute from './routes/answerRoute.js'
import tagRoute from './routes/tagRoute.js'
import notificationRoute from './routes/notificationRoute.js' // Thêm route thông báo
import publicUserRoute from './routes/publicUserRoute.js'
import { connectDB } from "./lib/db.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import {v2 as cloudinary} from 'cloudinary'
import cors from "cors";
import dns from "dns"


//DNS
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])



dotenv.config();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Public Routes
app.use('/api/auth', authRoute);
app.use('/api/questions', questionRoute);
app.use('/api/answers', answerRoute);
app.use('/api/tags', tagRoute);
app.use('/api/users', publicUserRoute);

// Private Routes
app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/notifications', notificationRoute); // Đăng ký route thông báo

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server đang khởi chạy ở ${PORT}`);
    });
});
