import {useContext, useState} from "react";
import {ChatContext} from "../context/ChatContext";
import {createConversationAuth, getConversationsAuth, searchUserAuth} from "../api/chatApi";
import {showToast} from "../utils/toast";

export const useChat = () => {
  //   const {} = useContext(ChatContext);
  const [loading, setLoading] = useState(false);
  const searchUser = async (query: string) => {
    setLoading(true);
    try {
      const response = await searchUserAuth(query);
      //   showToast.success(response.message);
      return response;
    } catch (error: any) {
      showToast.error(
        error?.message || "An error occurred during user search.",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (recipientId: string) => {
    try {
      const response = await createConversationAuth(recipientId);
      showToast.success(response.message);
      return response;
    } catch (error: string | any) {
      showToast.error(
        error?.message || "An error occurred while creating conversation.",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    searchUser,
    createConversation,
    loading,
  };
};
