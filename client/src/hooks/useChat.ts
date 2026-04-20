import { useState } from "react";
import {
  createConversationAuth,
  deleteMessageFromEveryoneAuth,
  
  searchUserAuth,
} from "../api/chatApi";
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

  const deleteMessageFromEveryone = async (
    conversationId: string,
    messageId: string,
  ) => {
    try {
      const response = await deleteMessageFromEveryoneAuth(
        conversationId,
        messageId,
      );
      console.log(response);
      if(response?.success) showToast.success(response.message);
      else showToast.error(response?.message || "Failed to delete message for everyone.");
      return response;
    } catch (error: string | any) {
      showToast.error(
        error?.message ||
          "An error occurred while deleting message for everyone.",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    searchUser,
    createConversation,
    deleteMessageFromEveryone,
    loading,
  };
};
