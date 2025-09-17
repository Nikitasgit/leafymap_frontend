import { Image } from "../image";
import { Place, PlacePopulated } from "../place";
import { Event, EventPopulated } from "../place/event";

export interface Partnership {
  _id: string;
  place?: string | Place;
  event?: string | Event;
  initiator: {
    _id: string;
    name?: string;
    image?: string | Image;
    categories?: string[];
  };
  collaborator: {
    _id: string;
    name?: string;
    image?: string | Image;
    categories?: string[];
  };
  status: "pending" | "accepted" | "refused";
  type?: "place" | "event";
  deleted?: boolean;
}

export interface PartnershipPopulated extends Partnership {
  place: PlacePopulated;
  event: EventPopulated;
}