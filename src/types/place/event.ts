import type { Place } from ".";
import type { BaseEntity, Location } from "../common";
import type { Image } from "../image";
import type { Partnership } from "../partnerships";
import type { Period } from "./schedule";
import type { User } from "../user";
import type { EventCategory } from "../categories";

export interface EventDateRange {
  firstDate: Date | string;
  latestDate: Date | string;
}

export interface Event extends BaseEntity {
  name: string;
  description: string;
  eventCategory: string | EventCategory;
  image: string | Image;
  schedule: Period[];
  partnerships: Partnership[];
  status: "cancelled" | "full" | "available";
  lifecycleStatus: "upcoming" | "ongoing" | "completed" | "unvalid";
  dateRange: EventDateRange;
  rating: number;
  user?: string | User;
  place?: Place | string | null;
  location?: Location | null;
  online?: boolean;
  isBookable?: boolean;
  capacity?: number | null;
  maxSeatsPerBooking?: number;
  bookedSeats?: number;
  remainingSeats?: number | null;
}

export interface EventPopulated extends Event {
  image: Image;
}
