import axios from "./axios.ts";

export const searchUserAuth = async (query: string) => {
  try {
    const response = await axios.get("/chat/users/search", {
      params: {query},
    });
    return response.data;
  } catch (error: any) {
    return (
      error?.response.data || {
        success: false,
        message: "An error occurred during user search.",
      }
    );
  }
};

export const createConversationAuth = async (recipientId: string) => {
  try {
    const response = await axios.post("/chat/conversations", {recipientId});
    return response.data;
  } catch (error: any) {
    return (
      error?.response.data || {
        success: false,
        message: "An error occurred while creating conversation.",
      }
    );
  }
};

export const getConversationsAuth = async () => {
  try {
    const response = await axios.get("/chat/conversations");
    return response.data;
  } catch (error: any) {
    return (
      error?.response.data || {
        success: false,
        message: "An error occurred while fetching conversations.",
      }
    );
  }
};

export const getMessagesAuth = async (conversationId: string) => {
  try {
    const response = await axios.get(
      `/chat/conversations/${conversationId}/messages`,
    );
    return response.data;
  } catch (error: any) {
    return (
      error?.response.data || {
        success: false,
        message: "An error occurred while fetching messages.",
      }
    );
  }
};
