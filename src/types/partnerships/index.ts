import { UserCategory } from "../categories";
import { Image } from "../image";
import { Place, PlacePopulated } from "../place";
import { Event, EventPopulated } from "../place/event";

export interface Partnership {
  _id: string;
  place?: string | Place;
  event?: string | Event;
  initiator?: {
    _id: string;
    username?: string;
    name?: string;
    image?: Image;
    userCategory?: UserCategory;
  };
  collaborator: {
    _id: string;
    username?: string;
    image?: Image | string;
    userCategory?: UserCategory;
  };
  status: "pending" | "accepted";
  deleted?: boolean;
}

export interface PartnershipPopulated extends Partnership {
  place: PlacePopulated;
  event: EventPopulated;
  collaborator: {
    _id: string;
    username?: string;
    image?: Image | string;
    userCategory?: UserCategory;
  };
}
