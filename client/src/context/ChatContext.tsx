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

  // function
  getConversations: () => Promise<any>;
  getMessages: (conversationId: string) => Promise<any>;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export default function ChatProvider({children}: {children: React.ReactNode}) {

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  const [messages, setMessages] = useState<any[]>([]);

  const getConversations = async () => {
    try {
      const response = await getConversationsAuth();
      // console.log(response.conversations);

      if (response.success) {
        setConversations(response.conversations);
      }
    } catch (error: any) {
      showToast.error(
        error?.message || "An error occurred while fetching conversations.",
      );
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
    <ChatContext.Provider value={{conversations, getConversations , setConversations, selectedConversation, setSelectedConversation, getMessages , messages, setMessages}}>
      {children}
    </ChatContext.Provider>
  );
}
