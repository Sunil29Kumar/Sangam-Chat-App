import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./database/db.js";
import checkAuth from "./middleware/authMiddleware.js";
import { socket } from "./socket/socket.js";

await connectDB();

const PORT = process.env.PORT || 9999;
const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_KEY));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const server = createServer(app);

socket(server);

// Routes
app.get("/", (req, res) => res.send("Server Working 🚀"));
app.use("/auth", authRoutes);
app.use("/user", checkAuth, userRoutes);
app.use("/chat", checkAuth, chatRoutes);

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});