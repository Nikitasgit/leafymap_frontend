import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { useLoading } from "./useLoading";
import { EventBooking } from "@/types/eventBooking";

export const useMyBookingForEvent = (
  eventId?: string,
  isAuthenticated: boolean = false
) => {
  const [booking, setBooking] = useState<EventBooking | null>(null);
  const { isLoading, withLoading } = useLoading(true);

  const fetchBooking = useCallback(async () => {
    try {
      const response = await apiClient.get(
        `/api/event-bookings/event/${eventId}/me`,
        {}
      );
      setBooking(response.data?.data ?? null);
    } catch {
      setBooking(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  useEffect(() => {
    if (eventId && isAuthenticated) {
      withLoading(fetchBooking);
    } else {
      setBooking(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, isAuthenticated]);

  const refetch = useCallback(() => {
    if (eventId && isAuthenticated) {
      fetchBooking();
    }
  }, [eventId, isAuthenticated, fetchBooking]);

  return { booking, isLoading, refetch };
};

