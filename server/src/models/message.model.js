import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    content: { type: String, },
    isRead: { type: Boolean, default: false },
    readedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', }],
    replyTo: {
        messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
        replayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String }
    }
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);
export default Message;