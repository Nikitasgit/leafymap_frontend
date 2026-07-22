import { request } from "@/shared/api/client";
import type {
  EventBooking,
  EventBookingWithUser,
  MyEventBooking,
} from "../types/eventBooking";

export const fetchMyBookingForEvent = async (
  eventId: string,
): Promise<EventBooking | null> => {
  const data = await request<EventBooking | null>({
    method: "GET",
    url: `/api/event-bookings/event/${eventId}/me`,
  });
  return data ?? null;
};

export const fetchEventBookingsForEvent = async (
  eventId: string,
): Promise<EventBookingWithUser[]> => {
  const data = await request<EventBookingWithUser[]>({
    method: "GET",
    url: `/api/event-bookings/event/${eventId}`,
  });
  return Array.isArray(data) ? data : [];
};

export const fetchMyEventBookings = async (): Promise<MyEventBooking[]> => {
  const data = await request<MyEventBooking[]>({
    method: "GET",
    url: `/api/event-bookings/me`,
  });
  return Array.isArray(data) ? data : [];
};

export const createEventBooking = async (
  eventId: string,
  seats: number,
): Promise<EventBooking> => {
  return request<EventBooking>({
    method: "POST",
    url: `/api/event-bookings/event/${eventId}`,
    data: { seats },
  });
};

export const updateEventBooking = async (
  bookingId: string,
  seats: number,
): Promise<EventBooking> => {
  return request<EventBooking>({
    method: "PUT",
    url: `/api/event-bookings/${bookingId}`,
    data: { seats },
  });
};

export const cancelEventBooking = async (bookingId: string): Promise<void> => {
  await request<void>({
    method: "DELETE",
    url: `/api/event-bookings/${bookingId}`,
  });
};
