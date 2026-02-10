import type { NotificationActionType } from "@/types/notifications";

/**
 * Retourne un message en français pour une action de notification.
 */
export function translateNotificationAction(
  action: NotificationActionType
): string {
  const messages: Record<NotificationActionType, string> = {
    message: "Nouveau message",
    partnership_invitation: "Demande de collaboration",
    partnership_accepted: "Collaboration acceptée",
    event_invitation: "Invitation à un événement",
    event_accepted: "Invitation à un événement acceptée",
    event_refused: "Invitation à un événement refusée",
    review: "Nouvel avis",
    new_follower: "Nouvel abonné",
    other: "Notification",
  };
  return messages[action] ?? "Notification";
}
