import { Image } from "../image";
import { UserCategory } from "../categories";
import { EventDateRange } from "../place/event";
import { Period } from "../place/schedule";

export interface EventInvitationEvent {
  _id: string;
  name: string;
  description?: string;
  image?: Image;
  schedule?: Period[];
  status?: "cancelled" | "full" | "available";
  lifecycleStatus?: "upcoming" | "ongoing" | "completed" | "unvalid";
  dateRange?: EventDateRange;
}

export interface EventInvitationPopulated {
  _id: string;
  event: EventInvitationEvent;
  initiator?: {
    _id: string;
    username?: string;
    image?: Image;
    userCategories?: UserCategory[];
  };
  collaborator?: {
    _id: string;
    username?: string;
    image?: Image;
    userCategories?: UserCategory[];
  };
  status: "pending" | "accepted" | "refused" | "cancelled" | "completed";
  deleted?: boolean;
}
