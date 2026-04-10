import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 30, // 30 days
    },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;