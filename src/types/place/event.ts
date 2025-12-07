import { Place } from ".";
import { BaseEntity } from "../common";
import { Image } from "../image";
import { Partnership } from "../partnerships";
import { Period } from "./schedule";

export interface Event extends BaseEntity {
  name: string;
  description: string;
  image: string | Image;
  schedule: Period[];
  partnerships: Partnership[];
  status:
    | "cancelled"
    | "full"
    | "available"
    | "upcoming"
    | "ongoing"
    | "completed"
    | "unvalid";
  rating: number;
  place: Place;
}

export interface EventPopulated extends Event {
  image: Image;
}