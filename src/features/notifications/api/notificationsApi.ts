import { request } from "@/shared/api/client";
import type { Notification, NotificationActionType } from "../types";

export type FetchNotificationsResult = {
  notifications: Notification[];
  unreadConversations: number;
};

export const fetchNotifications =
  async (): Promise<FetchNotificationsResult> => {
    return request<FetchNotificationsResult>({
      method: "GET",
      url: "/api/notifications",
    });
  };

export const markConversationAsRead = async (
  conversationId: string,
): Promise<void> => {
  await request<void>({
    method: "PUT",
    url: `/api/messages/conversation/${conversationId}/read`,
  });
};

export const markNotificationsAsReadByAction = async (
  action: NotificationActionType,
): Promise<void> => {
  await request<void>({
    method: "PATCH",
    url: "/api/notifications/read",
    data: { action },
  });
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await request<void>({
    method: "PATCH",
    url: "/api/notifications/read-all",
  });
};
