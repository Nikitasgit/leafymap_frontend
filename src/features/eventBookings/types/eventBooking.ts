import type { Image } from "@/shared/types/image";
import type { EventDateRange } from "@/features/events/types/event";

export interface EventBookingEvent {
  id: string;
  name: string;
  description?: string;
  image?: Image;
  status?: "cancelled" | "full" | "available";
  lifecycleStatus?: "upcoming" | "ongoing" | "completed" | "unvalid";
  dateRange?: EventDateRange;
  online?: boolean;
  location?: { label?: string } | null;
  isBookable?: boolean;
  capacity?: number | null;
  maxSeatsPerBooking?: number;
  deleted?: boolean;
  user?: {
    id: string;
    username?: string;
    image?: Image;
  };
  place?: {
    id: string;
    location?: { label?: string };
    user?: { id: string; username?: string };
  } | null;
}

export interface EventBookingUser {
  id: string;
  username?: string;
  email?: string;
  image?: Image;
}

export type EventBookingStatus = "confirmed" | "cancelled";

export interface EventBooking {
  id: string;
  seats: number;
  status: EventBookingStatus;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MyEventBooking extends EventBooking {
  event: EventBookingEvent;
}

export interface EventBookingWithUser extends EventBooking {
  user: EventBookingUser;
}
