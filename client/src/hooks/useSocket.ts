import { useContext } from "react";
import { socketContext } from "../context/socketContext";

export const useSocket = () => {
    const context = useContext(socketContext);
    if (!context) throw new Error("useSocket must be used within SocketProvider");

    const { socket } = context;

    const joinRoom = (conversationId: string) => {
        socket?.emit("join_chat", conversationId);
    };

    const sendMessage = (messageData: any) => {
        socket?.emit("new_message", messageData);
    };

    return { socket, joinRoom, sendMessage };
};