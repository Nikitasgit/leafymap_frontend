import { request } from "@/shared/api/client";
import type { Conversation, Message } from "../types";

export const findConversationWithUser = async (
  otherUserId: string,
): Promise<string | null> => {
  try {
    const data = await request<{ conversationId?: string }>({
      method: "GET",
      url: `/api/messages/conversation/with/${otherUserId}`,
    });
    return data?.conversationId || null;
  } catch (error) {
    console.error("Error finding conversation with user:", error);
    return null;
  }
};

export const fetchConversations = async (): Promise<Conversation[]> => {
  const data = await request<Conversation[]>({
    method: "GET",
    url: `/api/messages/conversations`,
  });
  return Array.isArray(data) ? data : [];
};

export const fetchConversationMessages = async (
  conversationId: string,
): Promise<Message[]> => {
  const data = await request<{ messages?: Message[] }>({
    method: "GET",
    url: `/api/messages/conversation/${conversationId}`,
  });
  return Array.isArray(data?.messages) ? data.messages : [];
};

export type SendMessagePayload = {
  recipientId: string;
  content: string;
};

export type SendMessageResult = {
  id: string;
  conversationId: string;
};

export const sendMessage = async (
  payload: SendMessagePayload,
): Promise<SendMessageResult> => {
  return request<SendMessageResult>({
    method: "POST",
    url: `/api/messages`,
    data: payload,
  });
};
