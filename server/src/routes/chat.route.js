
import express from "express";
import { createConversation, deleteMessageForMe, deleteMessageFromEveryone, getConversations, getMessages, searchUser } from "../controllers/chat.controller.js";
import { chatGuard } from "../middleware/chatGuard.js";


const router = express.Router()

// Search users by username or email
router.get("/users/search", searchUser);

// conversation routes

// Create a new conversation or return existing one
router.get("/conversations", getConversations);
router.post("/conversations", createConversation);

// Message routes
router.get("/conversations/:conversationId/messages", getMessages)
router.delete("/conversations/:conversationId/messages/:messageId/delete_for_everyone", chatGuard({ checkSender: true }), deleteMessageFromEveryone);

router.delete("/conversations/:conversationId/messages/:messageId/delete_for_me", chatGuard({ checkSender: false }), deleteMessageForMe);

export default router;