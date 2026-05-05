import {useCallback, useContext} from "react";
import {ChatContext} from "../context/ChatContext";
import {AuthContext} from "../context/AuthContext";
import {SocketContext} from "../context/SocketContext";

export const useSocket = () => {
  const context = useContext(SocketContext);
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);

  if (!context) throw new Error("useSocket must be used within SocketProvider");
  const {socket} = context;

  if (!authContext) return null;
  const {user} = authContext;

  if (!chatContext) return null;
  const {
    selectedConversation,
    setMessages,
    setIsTyping,
    setTypingStatus,
    updateLastMessageInList,
    setConversations,
  } = chatContext;

  const joinRoom = (conversationId: string) => {
    socket?.emit("join_chat", conversationId);
  };

  const handleNewMessage = useCallback((message: any) => {
    if (message.conversationId === selectedConversation?._id) {
      setMessages((prev) => [...prev, message]);
      socket.emit("mark_as_read", {
        conversationId: selectedConversation._id,
        userId: (user as any)?._id,
      });
    }

    // send confirmation
    updateLastMessageInList(message);
    if (message.sender?._id !== (user as any)._id) {
      socket.emit("message_delivered", {
        messageId: message._id,
        senderId: message.sender._id,
      });
    }
  },[setMessages, selectedConversation, socket, updateLastMessageInList, user]);

  const handleDisplayTyping = (data) => {
    setIsTyping(true);
    setTypingStatus(`${data.senderName} typing...`);
  };

  const handleHideTyping = () => {
    setIsTyping(false);
    setTypingStatus("");
  };

  const handleMessageStatusUpdate = ({messageId, status, conversationId}) => {
    if (conversationId === selectedConversation?._id) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                isDelivered: status === "delivered" ? true : msg.isDelivered,
              }
            : msg,
        ),
      );

      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId
            ? {
                ...conv,
                lastMessage: {
                  ...conv.lastMessage,
                  isDelivered:
                    status === "delivered"
                      ? true
                      : conv.lastMessage.isDelivered,
                  isRead: status === "read" ? true : conv.lastMessage.isRead,
                },
              }
            : conv,
        ),
      );
    }
  };

  const handleMessageMarkedAsRead = ({conversationId, readBy}) => {
    if (selectedConversation?._id === conversationId) {
      // 1. Chat Window ke saare messages ko UI mein read dikhao
      setMessages((prev) =>
        prev.map((m) => ({
          ...m,
          isRead: true,
          readedBy: [...m.readedBy, readBy],
        })),
      );

      // 2. Conversations list mein bhi last message ke read status ko update karo
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId
            ? {
                ...conv,
                lastMessage: {
                  ...conv.lastMessage,
                  isRead: true,
                },
              }
            : conv,
        ),
      );
    }
  };

  return {
    socket,
    joinRoom,
    handleDisplayTyping,
    handleHideTyping,
    handleNewMessage,
    handleMessageStatusUpdate,
    handleMessageMarkedAsRead,
  };
};
