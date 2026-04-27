import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const chatGuard = (options = { checkSender: false }) => {
    return async (req, res, next) => {
        try {
            const { conversationId , messageId} = req.params;
            const userID = req.user._id;
            console.log(userID);
            
            // 1. Basic Check: Kya ids bheji gayi hain?
            if (!messageId || !conversationId) {
                return res.status(400).json({ message: "Message/Conversation ID missing", success: false });
            }
            // 2. Conversation Check: Kya user is chat ka hissa hai?
            const conversation = await Conversation.findOne({
                _id: conversationId,
                participants: userID, // Ensure user is in this conversation
            });

            if (!conversation) {
                return res.status(403).json({ message: "Access denied. You are not a member of this chat.", success: false });
            }

            // 3. Message Check: Kya ye message exist karta hai aur isi conversation ka hai?
            const message = await Message.findById(messageId);
            if (!message) {
                return res.status(404).json({ message: "Message not found", success: false });
            }

            if (message.conversationId.toString() !== conversationId) {
                return res.status(400).json({ message: "Message does not belong to this conversation", success: false });
            }

            // 4. Sender Check (Optional): Kuch operations ke liye sirf sender allowed hai
            if (options.checkSender) {
                if (message.sender.toString() !== userID.toString()) {
                    return res.status(403).json({ message: "Unauthorized. Only sender can perform this action." , success: false });
                }
            }
            // 5. Success: Data ko req object mein daal do taaki controller use kar sake
            req.chatContext = { message, conversation };
            next();
            
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", success: false , error: error.message });
        }
    }
}