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
import similarityRoute from './routes/similarityRoute.js'
import adminRoute from './routes/adminRoute.js'
import commentRoute from './routes/commentRoute.js'
import { connectDB } from "./lib/db.js";
import { protectedRoute, optionalAuth } from "./middlewares/authMiddleware.js";
import settingRoute from './routes/settingRoute.js'
import { maintenanceMiddleware } from "./middlewares/maintenanceMiddleware.js";
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

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

// Một số route cần biết user nhưng không bắt buộc (để maintenance middleware check role)
app.use(optionalAuth); 
// Áp dụng maintenance middleware cho tất cả các route sau đây
app.use(maintenanceMiddleware);

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
app.use('/api/similarity', similarityRoute);
app.use('/api/settings', settingRoute);
app.use('/api/comments', commentRoute);

// Private Routes
app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/notifications', notificationRoute); // Đăng ký route thông báo
app.use('/api/admin/reports', adminRoute); // Đăng ký route Admin báo cáo

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server đang khởi chạy ở ${PORT}`);
    });
});
