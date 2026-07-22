import type { Place } from "@/features/places/types/place";
import type { BaseEntity, Location } from "@/shared/types/common";
import type { Image } from "@/shared/types/image";
import type { Partnership } from "@/features/partnerships/types";
import type { Period } from "@/features/places/types/schedule";
import type { User } from "@/features/users/types";
import type { EventCategory } from "@/shared/types/categories";

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
