import {createContext, useEffect, useState} from "react";
import {getConversationsAuth, getMessagesAuth} from "../api/chatApi";
import {showToast} from "../utils/toast";

interface ChatContextType {
  // state
  conversations: any[];
  setConversations: React.Dispatch<React.SetStateAction<any[]>>;
  selectedConversation: any | null;
  setSelectedConversation: (conversation: any | null) => void;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  typingStatus: string;
  setTypingStatus: (status: string) => void;
  replyingData: any;
  setReplyingData: (data: any) => void;
  isReplyContainerOpen: boolean;
  setIsReplyContainerOpen: (value: boolean) => void;

  // function
  getConversations: () => Promise<any>;
  getMessages: (conversationId: string) => Promise<any>;
  updateLastMessageInList: (message: any) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export default function ChatProvider({children}: {children: React.ReactNode}) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState("");

  const [replyingData, setReplyingData] = useState({
    messageSender: {},
    replyToMessageId: "",
    replyToMessageText: "",
    conversationId: "",
  });
  const [isReplyContainerOpen, setIsReplyContainerOpen] = useState(false);

  const getConversations = async () => {
    setLoading(true);

    try {
      const response = await getConversationsAuth();

      if (response.success) {
        setConversations(response.conversations);
        setLoading(false);
      }
    } catch (error: any) {
      showToast.error(
        error?.message || "An error occurred while fetching conversations.",
      );
      setLoading(false);
    }
  };


  const getMessages = async (conversationId: string) => {
    try {
      const response = await getMessagesAuth(conversationId);
      if (response.success) {
        setMessages(response.messages);
      }
    } catch (error: any) {
      showToast.error(
        error?.message || "An error occurred while fetching messages.",
      );
    }
  };

  // ChatProvider ke andar
  const updateLastMessageInList = (message : any) => {
    setConversations((prevConversations) => {
      return prevConversations.map((conv) => {
        if (conv._id === message.conversationId) {
          return {
            ...conv,
            lastMessage: {
              text: message.content,
              sender: message.sender._id || message.sender,
              isDelivered: message.isDelivered || false,
              isRead: message.isRead || false,
              createdAt: message.createdAt || new Date(),
            },
          };
        }
        return conv;
      });
    });
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        getConversations,
        setConversations,
        selectedConversation,
        setSelectedConversation,
        getMessages,
        messages,
        setMessages,
        loading,
        setLoading,
        isTyping,
        setIsTyping,
        typingStatus,
        setTypingStatus,
        replyingData,
        setReplyingData,
        isReplyContainerOpen,
        setIsReplyContainerOpen,
        updateLastMessageInList,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
