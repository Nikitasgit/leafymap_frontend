import { APP_URL } from "@/shared/config/app";
import { request } from "@/shared/api/client";
import type { Event } from "../types/event";

export const getEventById = async (eventId: string) => {
  try {
    return await request<Event>({
      method: "GET",
      url: `/api/events/${eventId}`,
      headers: {
        Origin: APP_URL,
      },
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Erreur lors du chargement de l'événement";
    return errorMessage;
  }
};

export const fetchEventById = async (eventId: string): Promise<Event> => {
  return request<Event>({
    method: "GET",
    url: `/api/events/${eventId}`,
  });
};

export const searchEvents = async (
  search: string,
  limit = 10,
): Promise<Event[]> => {
  const data = await request<Event[]>({
    method: "GET",
    url: `/api/events`,
    params: {
      search,
      limit,
      sortBy: "dateRange.firstDate",
      order: "asc",
    },
    headers: {
      Origin: APP_URL,
    },
  });
  return Array.isArray(data) ? data : [];
};

export const fetchUserEvents = async (
  userId: string,
  lifecycleStatus?: ("upcoming" | "ongoing" | "completed" | "unvalid")[],
): Promise<Event[]> => {
  const data = await request<Event[] | { events?: Event[] }>({
    method: "GET",
    url: `/api/events`,
    params: {
      userId,
      ...(lifecycleStatus && lifecycleStatus.length > 0
        ? { lifecycleStatus: lifecycleStatus.join(",") }
        : {}),
    },
  });
  if (Array.isArray(data)) return data;
  return data?.events ?? [];
};

export const fetchEventsSuggestions = async (
  limit = 30,
): Promise<Event[]> => {
  const data = await request<Event[] | { events?: Event[] }>({
    method: "GET",
    url: `/api/events`,
    params: {
      limit,
      sortBy: "createdAt",
      order: "desc",
    },
  });
  if (Array.isArray(data)) return data;
  return data?.events ?? [];
};

export const fetchEventsInView = async (
  params: Record<string, string | number | boolean | null | undefined>,
): Promise<Event[]> => {
  const data = await request<Event[]>({
    method: "GET",
    url: `/api/events/in-view`,
    params,
  });
  return Array.isArray(data) ? data : [];
};

export const createEvent = async (payload: unknown): Promise<Event> => {
  return request<Event>({
    method: "POST",
    url: `/api/events`,
    data: payload,
  });
};

export const updateEvent = async (
  eventId: string,
  payload: unknown,
): Promise<Event> => {
  return request<Event>({
    method: "PUT",
    url: `/api/events/${eventId}`,
    data: payload,
  });
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  await request<void>({ method: "DELETE", url: `/api/events/${eventId}` });
};
