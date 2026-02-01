import { useEffect, useCallback } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchUserNotifications,
  selectNotifications,
  selectUnreadMessagesCount,
} from "@/store/notificationSlice";

export const useUserNotifications = (options?: {
  autoFetch?: boolean;
  refetchInterval?: number;
}) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadMessagesCount = useAppSelector(selectUnreadMessagesCount);

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

  return {
    unreadMessagesCount,
    isLoading: notifications.loading,
    error: notifications.error,
    refetch: fetchNotifications,
    markConversationAsRead,
  };
};
