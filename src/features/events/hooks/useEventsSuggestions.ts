import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchEventsSuggestions as fetchEventsSuggestionsRequest } from "../api/eventsApi";
import { EventPopulated } from "../types/event";

const EVENTS_SUGGESTIONS_LIMIT = 30;

export const useEventsSuggestions = () => {
  const { t } = useTranslation("events");
  const [hasFetched, setHasFetched] = useState(false);

  const {
    data: events,
    isLoading,
    refetch,
  } = useApiQuery<EventPopulated[]>(
    async () => {
      try {
        return (await fetchEventsSuggestionsRequest(
          EVENTS_SUGGESTIONS_LIMIT,
        )) as EventPopulated[];
      } finally {
        setHasFetched(true);
      }
    },
    {
      initialData: [],
      deps: [],
      errorMessage: t("eventsSuggestions.loadError"),
    },
  );

  return { events, isLoading, hasFetched, fetchEvents: refetch };
};
