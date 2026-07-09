import { useState, useCallback, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { EventPopulated } from "@/types/place/event";
import { useToast } from "./useToast";
import { useLoading } from "./useLoading";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

const EVENTS_SUGGESTIONS_LIMIT = 30;

export const useEventsSuggestions = () => {
  const [events, setEvents] = useState<EventPopulated[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();
  const { t } = useTranslation("events");

  const fetchEvents = useCallback(async (): Promise<EventPopulated[]> => {
    return withLoading(async () => {
      try {
        const params = new URLSearchParams({
          limit: EVENTS_SUGGESTIONS_LIMIT.toString(),
          sortBy: "createdAt",
          order: "desc",
        });
        const res = await apiClient.get(
          `/api/events?${params.toString()}`
        );
        const data = res.data?.data ?? [];
        setEvents(data);
        return data;
      } catch (err) {
        showError(
          getErrorMessage(err, t, t("eventsSuggestions.loadError"))
        );
        setEvents([]);
        return [];
      } finally {
        setHasFetched(true);
      }
    });
  }, [withLoading, showError, t]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { events, isLoading, hasFetched, fetchEvents };
};
