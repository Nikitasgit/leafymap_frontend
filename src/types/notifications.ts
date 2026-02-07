import type { ImageUrls } from "./image";

export type NotificationReferenceType =
  | "Place"
  | "Event"
  | "Partnership"
  | "Conversation"
  | "Message";

export type NotificationActionType =
  | "message"
  | "partnership_invitation"
  | "partnership_accepted"
  | "event_invitation"
  | "event_accepted"
  | "review"
  | "other";

export interface NotificationSender {
  _id: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  image?: {
    urls?: ImageUrls;
  };
}

export interface Notification {
  _id: string;
  action: NotificationActionType;
  reference: string;
  referenceType: NotificationReferenceType;
  read?: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  sender?: NotificationSender;
}

export interface NotificationGroup {
  count: number;
  notifications: Notification[];
}

export type NotificationsByType = Partial<
  Record<NotificationReferenceType, NotificationGroup>
>;
