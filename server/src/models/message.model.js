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
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // For Replying to Messages
    replyTo: {
        messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
        replayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String }
    },
    isEdited: { type: Boolean, default: false }
}, { timestamps: true });

// index for faster retrieval of messages in a conversation
MessageSchema.index({ conversationId: 1 });
MessageSchema.index({ conversationId: 1, createdAt: 1 });
MessageSchema.index({ sender: 1, createdAt: 1 });
MessageSchema.index({ content: "text", createdAt: 1 });

const Message = mongoose.model('Message', MessageSchema);
export default Message;