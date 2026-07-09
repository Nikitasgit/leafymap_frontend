import { APP_URL } from "@/utils/constants";
import { apiClient } from "@/lib/api/client";
import type { Event } from "@/types/place/event";

export const getEventById = async (eventId: string) => {
  try {
    const url = `/api/events/${eventId}`;
    const response = await apiClient.get(url, {
      headers: {
        Origin: APP_URL,
        "Content-Type": "application/json",
      },
    });
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Erreur lors du chargement de l'événement";
    return errorMessage;
  }
};

export const searchEvents = async (search: string, limit = 10): Promise<Event[]> => {
  const response = await apiClient.get(`/api/events`, {
    params: {
      search,
      limit,
      sortBy: "dateRange.firstDate",
      order: "asc",
    },
    headers: {
      Origin: APP_URL,
      "Content-Type": "application/json",
    },
  });

  return Array.isArray(response.data?.data) ? response.data.data : [];
};
