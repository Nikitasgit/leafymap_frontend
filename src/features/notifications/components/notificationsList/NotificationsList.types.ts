import type { Notification } from "../../types";

export interface NotificationsListProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
}
