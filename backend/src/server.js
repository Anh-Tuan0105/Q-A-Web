import { app, server } from "./lib/socket.js";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import questionRoute from './routes/questionRoute.js'
import answerRoute from './routes/answerRoute.js'
import tagRoute from './routes/tagRoute.js'
import { connectDB } from "./lib/db.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
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

// Public Routes
app.use('/api/auth', authRoute);
app.use('/api/questions', questionRoute);
app.use('/api/answers', answerRoute);
app.use('/api/tags', tagRoute);

// Private Routes
app.use(protectedRoute);
app.use('/api/users', userRoute);

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server đang khởi chạy ở ${PORT}`);
    });
});
