import type { Notification } from "@/types/notifications";

export interface NotificationsListProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
}
