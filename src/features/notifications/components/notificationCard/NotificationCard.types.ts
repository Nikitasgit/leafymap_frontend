import type { Notification } from "../../types";

export interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
}
