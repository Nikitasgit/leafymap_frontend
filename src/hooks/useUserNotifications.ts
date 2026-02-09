import { useEffect, useCallback } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchUserNotifications,
  selectNotifications,
  selectNotificationsList,
  selectUnreadCount,
} from "@/store/notificationSlice";
import type { NotificationActionType } from "@/types/notifications";

export const useUserNotifications = (options?: {
  autoFetch?: boolean;
  refetchInterval?: number;
}) => {
  const dispatch = useAppDispatch();
  const notificationsState = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const notifications = useAppSelector(selectNotificationsList);

  const fetchNotifications = useCallback(() => {
    dispatch(fetchUserNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (options?.autoFetch) {
      fetchNotifications();
    }
  }, [fetchNotifications, options?.autoFetch]);

  useEffect(() => {
    if (options?.refetchInterval && options.refetchInterval > 0) {
      const interval = setInterval(() => {
        fetchNotifications();
      }, options.refetchInterval);

      return () => clearInterval(interval);
    }
  }, [fetchNotifications, options?.refetchInterval]);

  const markConversationAsRead = useCallback(
    async (conversationId: string) => {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversation/${conversationId}/read`,
          {},
          { withCredentials: true }
        );
        fetchNotifications();
      } catch {}
    },
    [fetchNotifications]
  );

  const markNotificationsAsReadByAction = useCallback(
    async (action: NotificationActionType) => {
      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read`,
          { action },
          { withCredentials: true }
        );
        fetchNotifications();
      } catch {}
    },
    [fetchNotifications]
  );

  const markPartnershipInvitationsAsRead = useCallback(
    () => markNotificationsAsReadByAction("partnership_invitation"),
    [markNotificationsAsReadByAction]
  );

  const markEventInvitationsAsRead = useCallback(
    () => markNotificationsAsReadByAction("event_invitation"),
    [markNotificationsAsReadByAction]
  );
  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all`,
        {},
        { withCredentials: true }
      );
      fetchNotifications();
    } catch {}
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading: notificationsState.loading,
    error: notificationsState.error,
    refetch: fetchNotifications,
    markConversationAsRead,
    markNotificationsAsReadByAction,
    markPartnershipInvitationsAsRead,
    markEventInvitationsAsRead,
    markAllNotificationsAsRead,
  };
};
