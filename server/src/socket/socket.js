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

                // Database mein message save karein
                const newMessage = new Message({
                    sender: senderId,
                    content: content,
                    conversationId: conversationId,
                    replyTo: (replyTo?.messageId && replyTo?.replayerId && replyTo?.content) ?
                        {
                            messageId: replyTo?.messageId,
                            replayerId: replyTo?.replayerId,
                            content: replyTo?.content,

                        } : null
                });
                await newMessage.save();

                // Conversation ka preview update karein
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: {
                        text: content,
                        sender: senderId,
                        isRead: false,
                        isDelivered: false,
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
            socket.to(data.conversationId).emit("display_typing",  data );
        });

        socket.on("stop_typing", (data) => {
            socket.to(data.conversationId).emit("hide_typing", { data });
        });

        // Message Delivered Confirmation
        socket.on("message_delivered", async ({ messageId, senderId }) => {
            try {

                const updatedMessage = await Message.findByIdAndUpdate(
                    messageId,
                    { isDelivered: true },
                    { new: true }
                );

                if (updatedMessage) {
                    const updatedConversation = await Conversation.findOneAndUpdate(
                        { _id: updatedMessage.conversationId, },
                        {
                            $set: {
                                "lastMessage.isRead": false,
                                "lastMessage.isDelivered": true,
                            }
                        }, { new: true }
                    );
                }

                // Sender ko inform karo
                const senderSocketId = userSocketMap[senderId];
                if (senderSocketId) {
                    io.to(senderSocketId).emit("message_status_update", {
                        messageId,
                        status: "delivered",
                        conversationId: updatedMessage.conversationId // Conv ID bhi bhejo ChatList update ke liye
                    });
                }
            } catch (error) {
                console.error("Delivered status error:", error);
            }
        });

        socket.on("mark_as_read", async ({ conversationId, userId }) => {
            try {
                // Saare unread messages ko read mark karo jo is user ke liye hain
                await Message.updateMany(
                    { conversationId, sender: { $ne: userId }, isRead: false },
                    { $set: { isRead: true }, $push: { readedBy: userId } }
                )

                // 2. Conversation ka lastMessage status bhi update karo
                await Conversation.findByIdAndUpdate(
                    { _id: conversationId },
                    { $set: { "lastMessage.isRead": true } }
                    , { new: true }
                )

                // 3. Dusre participants ko batao ki messages read ho gaye hain
                // Taaki unki screen par ticks BLUE ho jayein
                socket.to(conversationId).emit("messages_marked_as_read", {
                    conversationId,
                    readBy: userId
                });

            } catch (error) {
                console.error("Read status error:", error);
            }
        })


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