import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
  type: {
    type: String,
    enum: ['dm', 'group'],
    default: 'dm'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // for Group
  groupTitle: { type: String, trim: true },
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  groupAvatar: { type: String },

  // Optimization: Last message yahan store karne se Sidebar fast load hota hai
  lastMessage: {
    text: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isRead: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }
}, { timestamps: true });


const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;