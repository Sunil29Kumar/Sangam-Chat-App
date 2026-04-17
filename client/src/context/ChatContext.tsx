import {createContext, useEffect, useState} from "react";
import {getConversationsAuth, getMessagesAuth} from "../api/chatApi";
import {showToast} from "../utils/toast";

interface ChatContextType {
  // state
  conversations: any[];
  setConversations: (conversations: any[]) => void;
  selectedConversation: any | null;
  setSelectedConversation: (conversation: any | null) => void;
  messages: any[];
  setMessages: (messages: any[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;

  // function
  getConversations: () => Promise<any>;
  getMessages: (conversationId: string) => Promise<any>;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export default function ChatProvider({children}: {children: React.ReactNode}) {

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

    const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState("");

  const getConversations = async () => {
    setLoading(true);

    try {
      const response = await getConversationsAuth();
      // console.log(response.conversations);

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

  useEffect(() => {
    getConversations();
  }, []);


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

  return (
    <ChatContext.Provider value={{conversations, getConversations , setConversations, selectedConversation, setSelectedConversation, getMessages , messages, setMessages, loading, setLoading , isTyping, setIsTyping, typingStatus, setTypingStatus}}>
      {children}
    </ChatContext.Provider>
  );
}
