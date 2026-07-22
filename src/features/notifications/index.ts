// Public API of the notifications feature — import from "@/features/notifications" only.
// Prefer deep imports for the Redux model from store/
// Example: `@/features/notifications/model/notificationSlice`.

// Types
export type {
  Notification,
  NotificationActionType,
  NotificationReferenceType,
  NotificationSender,
} from "./types";

// API
export {
  fetchNotifications,
  markConversationAsRead as markConversationAsReadApi,
  markNotificationsAsReadByAction as markNotificationsAsReadByActionApi,
  markAllNotificationsAsRead as markAllNotificationsAsReadApi,
} from "./api/notificationsApi";
export type { FetchNotificationsResult } from "./api/notificationsApi";

// Hooks
export { useUserNotifications } from "./hooks/useUserNotifications";

// Model (slice actions / selectors — needed by store & other features)
export {
  default as notificationReducer,
  fetchUserNotifications,
  resetNotifications,
  selectNotifications,
  selectNotificationsList,
  selectUnreadCount,
  selectUnreadConversations,
} from "./model/notificationSlice";

// Utils
export { translateNotificationAction } from "./utils/translateNotificationAction";

// Components
export { default as NotificationCard } from "./components/notificationCard";
export { default as NotificationsList } from "./components/notificationsList";
export { default as NavbarNotifications } from "./components/navbarNotifications";
