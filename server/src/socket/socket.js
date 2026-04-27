import { Server } from "socket.io";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import dotenv from "dotenv";

dotenv.config();


export const socket = (server) => {
    // Socket.IO Setup
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });

    const userSocketMap = {}; // { userId: socketId }

    // --- EK HI CONNECTION BLOCK RAKHEIN ---
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
            console.log(`✅ User Connected: ${userId} (Socket: ${socket.id})`);
        }

        // Saare clients ko online users ki list bhejein
        io.emit("get_online_users", Object.keys(userSocketMap));

        // 1. Join Chat Room
        socket.on("join_chat", (conversationId) => {
            socket.join(conversationId);
            console.log(`📁 Room Joined: ${conversationId} by User: ${userId}`);
        });

        // 2. Send & Save Message
        socket.on("send_message", async ({ senderId, content, conversationId, replyTo }) => {
            try {
                if (!content || !conversationId) return;

                // Check if conversation exists
                const conversation = await Conversation.findById(conversationId);
                if (!conversation) {
                    return;
                }

                // Check if sender is part of the conversation
                if (!conversation.participants.includes(senderId)) {
                    return;
                }

                // if sender is part of conversation , push message to message model (in content)
                console.log(replyTo);

                // Database mein message save karein
                const newMessage = new Message({
                    sender: senderId,
                    content: content,
                    conversationId: conversationId,
                    replyTo: (replyTo?.messageId && replyTo?.replayerId && replyTo?.content) ?
                        {
                            messageId: replyTo?.messageId, 
                            content: replyTo?.replyToMessageText, 
                            senderId: replyTo.replayerId

                        } : null
                });
                await newMessage.save();

                // Conversation ka preview update karein
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: {
                        text: content,
                        sender: senderId,
                        createdAt: new Date()
                    }
                });

                const populatedMsg = await newMessage.populate("sender", "name email profilePic");

                // Room mein sabko (including sender) naya message bhejein
                io.to(conversationId).emit("new_message", populatedMsg);

            } catch (error) {
                console.error("❌ Socket Message Error:", error);
            }
        });

        // 3. Typing Indicator
        socket.on("typing", (data) => {
            socket.to(data.conversationId).emit("display_typing", { data });
        });

        socket.on("stop_typing", (data) => {
            socket.to(data.conversationId).emit("hide_typing", { data });
        });

        // 4. Disconnect
        socket.on("disconnect", () => {
            if (userId) {
                console.log(`❌ User Disconnected: ${userId}`);
                delete userSocketMap[userId];
            }
            io.emit("get_online_users", Object.keys(userSocketMap));
        });
    });


}