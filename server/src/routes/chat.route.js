
import express from "express";
import { createConversation, getConversations, getMessages, searchUser } from "../controllers/chat.controller.js";


const router = express.Router()

// Search users by username or email
router.get("/users/search", searchUser);

// conversation routes

// Create a new conversation or return existing one
router.get("/conversations", getConversations);
router.post("/conversations", createConversation);

// Message routes
router.get("/conversations/:conversationId/messages",getMessages)


export default router;