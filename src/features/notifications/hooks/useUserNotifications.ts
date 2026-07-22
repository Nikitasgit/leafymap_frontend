import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchUserNotifications,
  selectNotifications,
  selectNotificationsList,
  selectUnreadCount,
} from "../model/notificationSlice";
import {
  markConversationAsRead as markConversationAsReadApi,
  markNotificationsAsReadByAction as markNotificationsAsReadByActionApi,
  markAllNotificationsAsRead as markAllNotificationsAsReadApi,
} from "../api/notificationsApi";
import type { NotificationActionType } from "../types";

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
        await markConversationAsReadApi(conversationId);
        fetchNotifications();
      } catch {}
    },
    [fetchNotifications]
  );

  const markNotificationsAsReadByAction = useCallback(
    async (action: NotificationActionType) => {
      try {
        await markNotificationsAsReadByActionApi(action);
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
      await markAllNotificationsAsReadApi();
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
