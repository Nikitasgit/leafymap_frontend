import type { Notification } from "@/types/notifications";

export interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
}
