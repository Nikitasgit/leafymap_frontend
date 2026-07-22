import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchEventById } from "../api/eventsApi";
import { EventPopulated } from "../types/event";

export const useEvent = (eventId: string) => {
  const { t } = useTranslation("events");

  const {
    data: event,
    isLoading,
    refetch,
  } = useApiQuery<EventPopulated | null>(
    async () => (await fetchEventById(eventId)) as EventPopulated,
    {
      initialData: null,
      enabled: !!eventId,
      deps: [eventId],
      errorMessage: t("useEvent.loadError"),
    },
  );

  return { event, isLoading, refetch };
};
