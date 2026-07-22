import type { ImageUrls } from "@/shared/types/image";

export type NotificationReferenceType =
  | "Place"
  | "Event"
  | "Partnership"
  | "Conversation"
  | "Message"
  | "Follow";

export type NotificationActionType =
  | "message"
  | "partnership_invitation"
  | "partnership_accepted"
  | "event_invitation"
  | "event_accepted"
  | "event_refused"
  | "event_booking_cancelled"
  | "review"
  | "new_follower"
  | "other";

export interface NotificationSender {
  id: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  image?: {
    urls?: ImageUrls;
  };
  googlePictureUrl?: string;
}

export interface Notification {
  id: string;
  action: NotificationActionType;
  reference: string;
  referenceType: NotificationReferenceType;
  read?: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  sender?: NotificationSender;
}
