import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchUserEvents } from "../api/eventsApi";
import { EventPopulated } from "../types/event";

export const useUserEvents = (
  userId: string | null,
  lifecycleStatus?: ("upcoming" | "ongoing" | "completed" | "unvalid")[],
) => {
  const { t } = useTranslation("events");

  const {
    data: events,
    isLoading,
    refetch,
  } = useApiQuery<EventPopulated[]>(
    async () =>
      (await fetchUserEvents(userId as string, lifecycleStatus)) as EventPopulated[],
    {
      initialData: [],
      enabled: !!userId,
      deps: [userId, lifecycleStatus],
      errorMessage: t("userEvents.loadError"),
    },
  );

  return { events, isLoading, refetch };
};
