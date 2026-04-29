import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    content: { type: String, },
    // For Delivery & Read Status (Double Ticks)
    isRead: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    readedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // For Message Deletion
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', }],
    // For Replying to Messages
    replyTo: {
        messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
        replayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String }
    }
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);
export default Message;