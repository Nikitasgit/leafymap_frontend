import { apiClient } from "@/lib/api/client";

export const findConversationWithUser = async (
  otherUserId: string
): Promise<string | null> => {
  try {
    const response = await apiClient.get(
      `/api/messages/conversation/with/${otherUserId}`,
    );

    return response.data?.data?.conversationId || null;
  } catch (error) {
    console.error("Error finding conversation with user:", error);
    return null;
  }
};
