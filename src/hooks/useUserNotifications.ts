import { useEffect, useCallback } from "react";
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
    if (options?.autoFetch !== false) {
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

  return {
    unreadMessagesCount,
    isLoading: notifications.loading,
    error: notifications.error,
    refetch: fetchNotifications,
  };
};
