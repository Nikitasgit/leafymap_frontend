import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchMyBookingForEvent } from "../api/eventBookingsApi";
import { EventBooking } from "../types/eventBooking";

export const useMyBookingForEvent = (
  eventId?: string,
  isAuthenticated: boolean = false,
) => {
  const {
    data: booking,
    isLoading,
    refetch,
  } = useApiQuery<EventBooking | null>(
    async () => {
      try {
        return await fetchMyBookingForEvent(eventId as string);
      } catch {
        return null;
      }
    },
    {
      initialData: null,
      enabled: !!eventId && isAuthenticated,
      deps: [eventId, isAuthenticated],
      errorMessage: "",
    },
  );

  return { booking, isLoading, refetch };
};
