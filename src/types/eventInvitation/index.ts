import { Image } from "../image";
import { UserCategory } from "../categories";
import { EventDateRange } from "../place/event";
import { Period } from "../place/schedule";

export interface EventInvitationEvent {
  id: string;
  name: string;
  description?: string;
  image?: Image;
  schedule?: Period[];
  status?: "cancelled" | "full" | "available";
  lifecycleStatus?: "upcoming" | "ongoing" | "completed" | "unvalid";
  dateRange?: EventDateRange;
}

export interface EventInvitationPopulated {
  id: string;
  event: EventInvitationEvent;
  initiator?: {
    id: string;
    username?: string;
    image?: Image;
    userCategory?: UserCategory;
  };
  collaborator?: {
    id: string;
    username?: string;
    image?: Image;
    userCategory?: UserCategory;
  };
  status: "pending" | "accepted" | "refused" | "cancelled" | "completed";
  deleted?: boolean;
}
