import {createContext, useCallback, useEffect, useState} from "react";
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
  isMessagesLoading: boolean;
  setIsMessagesLoading: (loading: boolean) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  typingStatus: string;
  setTypingStatus: (status: string) => void;
  replyingData: any;
  setReplyingData: (data: any) => void;
  isReplyContainerOpen: boolean;
  setIsReplyContainerOpen: (value: boolean) => void;
  editedMessage: {
    content: string;
    messageId: string;
    conversationId: string;
  };
  setEditedMessage: React.Dispatch<
    React.SetStateAction<{
      content: string;
      messageId: string;
      conversationId: string;
    }>
  >;

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
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState("");

  const [replyingData, setReplyingData] = useState({
    messageSender: {},
    replyToMessageId: "",
    replyToMessageText: "",
    conversationId: "",
  });
  const [isReplyContainerOpen, setIsReplyContainerOpen] = useState(false);

  const [editedMessage, setEditedMessage] = useState<{
    content: string;
    messageId: string;
    conversationId: string;
  }>({
    content: "",
    messageId: "",
    conversationId: "",
  });

  const getConversations = useCallback(async () => {
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
  }, []);

  const getMessages = useCallback(async (conversationId: string) => {
    setIsMessagesLoading(true);

    try {
      const response = await getMessagesAuth(conversationId);
      if (response.success) {
        setMessages(response.messages);
        setIsMessagesLoading(false);
      }
    } catch (error: any) {
      showToast.error(
        error?.message || "An error occurred while fetching messages.",
      );
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  // ChatProvider ke andar
  const updateLastMessageInList = (message: any) => {
    setConversations((prevConversations) => {
      return prevConversations.map((conv) => {
        if (conv?._id === message.conversationId) {
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

  // Frontend - ChatContext ya jahan conversation select ho rahi hai
  useEffect(() => {
    if (selectedConversation) {
      // 2. Local state update karo taaki badge turant gayab ho jaye
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedConversation._id ? {...c, unreadedMsgCount: 0} : c,
        ),
      );
    }
  }, [selectedConversation]);

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
        isMessagesLoading,
        setIsMessagesLoading,
        isTyping,
        setIsTyping,
        typingStatus,
        setTypingStatus,
        replyingData,
        setReplyingData,
        isReplyContainerOpen,
        setIsReplyContainerOpen,
        updateLastMessageInList,
        editedMessage,
        setEditedMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
