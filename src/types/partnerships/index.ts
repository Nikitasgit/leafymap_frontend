import { Image } from "../image";
import { Place } from "../place";
import { Event } from "../place/event";

export interface Partnership {
  _id: string;
  place?: string | Place;
  event?: string | Event;
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
