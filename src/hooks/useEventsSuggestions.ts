import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { EventPopulated } from "@/types/place/event";
import { useToast } from "./useToast";
import { useLoading } from "./useLoading";

const EVENTS_SUGGESTIONS_LIMIT = 30;

export const useEventsSuggestions = () => {
  const [events, setEvents] = useState<EventPopulated[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();

  const fetchEvents = useCallback(async (): Promise<EventPopulated[]> => {
    return withLoading(async () => {
      try {
        const params = new URLSearchParams({
          limit: EVENTS_SUGGESTIONS_LIMIT.toString(),
          sortBy: "createdAt",
          order: "desc",
        });
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events?${params.toString()}`
        );
        const data = res.data?.data ?? [];
        setEvents(data);
        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des événements";
        showError(message);
        setEvents([]);
        return [];
      } finally {
        setHasFetched(true);
      }
    });
  }, [withLoading, showError]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { events, isLoading, hasFetched, fetchEvents };
};
