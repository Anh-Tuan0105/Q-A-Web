import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketMiddleware } from "../middlewares/socketMiddleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    },
});

io.use(socketMiddleware);

io.on("connection", async (socket) => {
    const userId = socket.user?._id || "Guest";
    const username = socket.user?.userName || "Unknown";
    console.log(`A user connected. Socket: ${socket.id}, User ID: ${userId}, Name: ${username}`);

    if (userId !== "Guest") {
        socket.join(`user_${userId.toString()}`);
        console.log(`User ${socket.id} joined personal room user_${userId.toString()}`);
    }

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("leave_room", (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});

export { app, io, server };
