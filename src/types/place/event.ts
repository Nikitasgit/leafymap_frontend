import { Place } from ".";
import { BaseEntity } from "../common";
import { Partnership } from "../partnerships";
import { Period } from "./schedule";

export interface Event extends BaseEntity {
  name: string;
  description: string;
  image: string;
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
  place: Place;
}
