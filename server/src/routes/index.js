
import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import chatRoutes from "./chat.route.js";
import checkAuth from "../middleware/authMiddleware.js";

const rootRouter = express.Router();
rootRouter.get("", (req, res) => res.send("Server Running..."));
rootRouter.use("/auth", authRoutes);
rootRouter.use("/user", checkAuth, userRoutes);
rootRouter.use("/chat", checkAuth, chatRoutes);


export default rootRouter;