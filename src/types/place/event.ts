import { Place } from ".";
import { BaseEntity } from "../common";
import { Image } from "../image";
import { Partnership } from "../partnerships";
import { Period } from "./schedule";

export interface EventDateRange {
  firstDate: Date | string;
  latestDate: Date | string;
}

export interface Event extends BaseEntity {
  name: string;
  description: string;
  image: string | Image;
  schedule: Period[];
  partnerships: Partnership[];
  status: "cancelled" | "full" | "available";
  lifecycleStatus: "upcoming" | "ongoing" | "completed" | "unvalid";
  dateRange: EventDateRange;
  rating: number;
  place: Place;
}

export interface EventPopulated extends Event {
  image: Image;
}
