import {useContext, useState} from "react";
import {
  convertSpeechToTextAuth,
  createConversationAuth,
  deleteConversationAuth,
  deleteMessageFromEveryoneAuth,
  deleteMessageFromMeAuth,
  editMessageAuth,
  pinMessageAuth,
  searchUserAuth,
} from "../api/chatApi";
import {showToast} from "../utils/toast";
import {ChatContext} from "../context/ChatContext";

export const useChat = () => {
  const chatContext = useContext(ChatContext);
  const [loading, setLoading] = useState(false);

  if (!chatContext) return null;
  const {
    getMessages,
    getConversations,
    setSelectedConversation,
    setMessages,
    setConversations,
  } = chatContext;

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

  const deleteConversation = async (conversationId: string) => {
    try {
      const response = await deleteConversationAuth(conversationId);
      if (response?.success) {
        setConversations((prevConversations) =>
          prevConversations.filter((conv) => conv._id !== conversationId),
        );
        // setSelectedConversation(null);
        // setMessages([]);
        showToast.success(response.message);
      }
      // getConversations();
      return response;
    } catch (error: string | any) {
      showToast.error(
        error?.message || "An error occurred while deleting conversation.",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const pinnedMessage = async (conversationId: string, messageId: string) => {
    try {
      const response = await pinMessageAuth(conversationId, messageId);
      // console.log("pin res =",response);

      showToast.success(response.message);
      return response;
    } catch (error: string | any) {
      showToast.error(
        error?.message || "An error occurred while pinning message.",
      );
      return null;
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
      // getMessages(conversationId);
      if (response?.success) {
        showToast.success(response.message);
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId),
        );
      } else
        showToast.error(
          response?.message || "Failed to delete message for everyone.",
        );
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

  const deleteMessageForMe = async (
    conversationId: string,
    messageId: string,
  ) => {
    try {
      const response = await deleteMessageFromMeAuth(conversationId, messageId);
      if (response?.success) {
        showToast.success(response.message);
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId),
        );
      } else
        showToast.error(
          response?.message || "Failed to delete message for me.",
        );
    } catch (error: string | any) {
      showToast.error(
        error?.message || "An error occurred while deleting message for me.",
      );
      return null;
    }
  };

  const editMessage = async (
    conversationId: string,
    messageId: string,
    newContent: string,
  ) => {
    try {
      const response = await editMessageAuth(
        conversationId,
        messageId,
        newContent,
      );
      // getMessages(conversationId);
      if (response?.success) showToast.success(response.message);
      else showToast.error(response?.message || "Failed to edit message.");
      return response;
    } catch (error: string | any) {
      showToast.error(
        error?.message || "An error occurred while editing message.",
      );
      return null;
    }
  };

  const convertSpeechToText = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      // .wav ya .webm format browser ke recorder ke mutabik
      formData.append("audio", audioBlob, "voice_input.wav");
      
      const response = await convertSpeechToTextAuth(audioBlob);
      if (response?.success) {
        // showToast.success(
        //   response.message || "Speech converted to text successfully.",
        // );
      } else {
        showToast.error(
          response?.message || "Failed to convert speech to text.",
        );
      }
      return response;
    } catch (error) {
      showToast.error(
        error?.message || "An error occurred while converting speech to text.",
      );
      return "";
    }
  };

  return {
    searchUser,
    createConversation,
    deleteConversation,
    pinnedMessage,
    deleteMessageFromEveryone,
    deleteMessageForMe,
    editMessage,
    loading,
    convertSpeechToText,
  };
};
