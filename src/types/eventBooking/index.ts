import { Image } from "../image";
import { EventDateRange } from "../place/event";

export interface EventBookingEvent {
  _id: string;
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
    _id: string;
    username?: string;
    image?: Image;
  };
  place?: {
    _id: string;
    location?: { label?: string };
    user?: { _id: string; username?: string };
  } | null;
}

export interface EventBookingUser {
  _id: string;
  username?: string;
  email?: string;
  image?: Image;
}

export type EventBookingStatus = "confirmed" | "cancelled";

export interface EventBooking {
  _id: string;
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
