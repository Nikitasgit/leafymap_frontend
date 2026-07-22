import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchEventBookingsForEvent } from "../api/eventBookingsApi";
import { EventBookingWithUser } from "../types/eventBooking";

export const useEventBookingsForEvent = (eventId?: string) => {
  const { t } = useTranslation("events");

  const {
    data: eventBookings,
    isLoading,
    refetch,
  } = useApiQuery<EventBookingWithUser[]>(
    () => fetchEventBookingsForEvent(eventId as string),
    {
      initialData: [],
      enabled: !!eventId,
      deps: [eventId],
      errorMessage: t("eventBookingsForEvent.loadError"),
    },
  );

  return { eventBookings, isLoading, refetch };
};
