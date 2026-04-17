import { success } from "zod";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";


export const searchUser = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        // search user by username or email
        const user = await User.findOne({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ success: true, user , message: "User found" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const createConversation = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const senderId = req.user._id;

        console.log(recipientId);
        

        // Check if a conversation already exists between the sender and recipient
        let conversation = await Conversation.findOne({
            type: 'dm',
            participants: { $all: [senderId, recipientId] }
        });
        if (conversation) {
            return res.status(200).json({ conversation, isNew: false, message: "Conversation already exists" });
        }

        // If not, create a new conversation
        const newConversation = new Conversation({
            type: 'dm',
            participants: [senderId, recipientId]
        });

        console.log(newConversation);
        

        await newConversation.save();
        return res.status(201).json({ conversation: newConversation, isNew: true, message: "Conversation created successfully" , success: true});

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({
            participants: userId
        }).populate("participants", "name email conversations isOnline profilePic").sort({ updatedAt: -1 });

        const formattedConversations = conversations.map(conv => {
            const otherParticipant = conv.participants.find(p => p._id.toString() !== userId.toString());
            return { ...conv.toObject(), otherParticipant };
        });
        return res.status(200).json({ conversations: formattedConversations, message: "Conversations fetched successfully" ,success: true});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages" });
    }
};