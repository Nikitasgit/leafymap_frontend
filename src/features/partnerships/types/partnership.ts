import type { UserCategory } from "@/shared/types/categories";
import type { Image } from "@/shared/types/image";
import type { Place, PlacePopulated } from "@/features/places/types/place";
import type { Event, EventPopulated } from "@/features/events/types/event";

export interface Partnership {
  id: string;
  place?: string | Place;
  event?: string | Event;
  initiator?: {
    id: string;
    username?: string;
    name?: string;
    image?: Image;
    userCategory?: UserCategory;
  };
  collaborator: {
    id: string;
    username?: string;
    image?: Image | string;
    googlePictureUrl?: string;
    userCategory?: UserCategory;
  };
  status: "pending" | "accepted";
  deleted?: boolean;
}

export interface PartnershipPopulated extends Partnership {
  place: PlacePopulated;
  event: EventPopulated;
  collaborator: {
    id: string;
    username?: string;
    image?: Image | string;
    googlePictureUrl?: string;
    userCategory?: UserCategory;
  };
}
