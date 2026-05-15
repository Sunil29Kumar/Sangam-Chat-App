import { promise, success } from "zod";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";


// conversation controller 
export const searchUser = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query parameter is required", success: false });
        }

        // search user by username or email
        const user = await User.findOne({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({ success: true, user, message: "User found" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const createConversation = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const senderId = req.user._id;

        // Check if a conversation already exists between the sender and recipient
        let conversation = await Conversation.findOne({
            type: 'dm',
            participants: { $all: [senderId, recipientId] }
        });
        if (conversation) {
            return res.status(200).json({ conversation, isNew: false, message: "Conversation already exists", success: true });
        }

        // If not, create a new conversation
        const newConversation = new Conversation({
            type: 'dm',
            participants: [senderId, recipientId]
        });

        console.log(newConversation);


        await newConversation.save();
        return res.status(201).json({ conversation: newConversation, isNew: true, message: "Conversation created successfully", success: true });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found", success: false });
        }

        // Check if the user is a participant of the conversation
        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({ message: "You are not a participant of this conversation", success: false });
        }

        // Mark the conversation as deleted for the user
        const updatedConversation = await Conversation.findByIdAndUpdate(conversationId, { $push: { deletedBy: userId } }, { new: true });

        if (updatedConversation.deletedBy.length >= updatedConversation.participants.length) {
            
            await Conversation.findByIdAndDelete(conversationId);
            // Saath mein is conversation ke saare messages bhi delete kar dena chahiye
            await Message.deleteMany({ conversationId });
        }

        return res.status(200).json({ message: "Conversation deleted successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId
        }).populate("participants", "name email conversations isOnline lastSeen profilePic").populate("pinnedMessage", "content senderId createdAt").sort({ updatedAt: -1 });

        const formattedConversations = await Promise.all(conversations.map(async (conv) => {
            const otherParticipant = conv.participants.find((p) => p._id.toString() !== userId.toString());
            const count = await Message.countDocuments({
                conversationId: conv._id,
                isRead: false,
                sender: { $ne: userId }
            });
            return { ...conv.toObject(), otherParticipant, unreadedMsgCount: count };
        }));
        return res.status(200).json({ conversations: formattedConversations, message: "Conversations fetched successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const pinMessage = async (req, res) => {
    try {
        const { message, conversation } = req.chatContext;
        const io = req.app.get("io")

        const isAlreadyPinned = conversation.pinnedMessage?.toString() === message._id.toString();

        conversation.pinnedMessage = isAlreadyPinned ? null : message._id;
        await conversation.save();

        const updatedConv = await Conversation.findById(conversation._id).populate("pinnedMessage");

        io.to(conversation._id.toString()).emit("message_pinned_update", {
            pinnedMessage: updatedConv.pinnedMessage,
            conversationId: conversation._id
        });

        return res.status(200).json({
            message: isAlreadyPinned ? "Message unpinned" : "Message pinned",
            success: true,
            pinnedMessageId: conversation.pinnedMessage
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
}



// Message Controller 
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).populate("sender", "name email profilePic");
        return res.status(200).json({ success: true, messages });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching messages", success: false });
    }
};


export const deleteMessageFromEveryone = async (req, res) => {
    try {
        const { message } = req.chatContext;
        await Message.findByIdAndDelete(message._id);

        return res.status(200).json({ message: "Message deleted successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
}

export const deleteMessageForMe = async (req, res) => {
    try {
        const { message } = req.chatContext;
        const userId = req.user._id;
        await Message.findByIdAndUpdate(message._id, { $push: { deletedBy: userId } });

        return res.status(200).json({ message: "Message deleted for you", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
}

export const editMessage = async (req, res) => {
    try {
        const { message } = req.chatContext;
        const { newContent } = req.body;

        if (!newContent || newContent.trim() === "") {
            return res.status(400).json({ message: "New content cannot be empty", success: false });
        }
        if (message.isReaded) {
            return res.status(400).json({ message: "Cannot edit message that has been read by recipient(s)", success: false });
        }

        const updatedMessage = await Message.findByIdAndUpdate(message._id, { content: newContent, isEdited: true }, { new: true }).populate("sender", "name email profilePic");

        const io = req.app.get("io");
        io.to(message.conversationId.toString()).emit("message_edited", {
            messageId: updatedMessage._id,
            newContent: updatedMessage.content,
            isEdited: updatedMessage.isEdited
        });

        return res.status(200).json({ message: "Message updated successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
}