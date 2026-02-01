import axios from "axios";

export const findConversationWithUser = async (
  otherUserId: string
): Promise<string | null> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversation/with/${otherUserId}`,
      { withCredentials: true }
    );

    return response.data?.data?.conversationId || null;
  } catch (error) {
    console.error("Error finding conversation with user:", error);
    return null;
  }
};
