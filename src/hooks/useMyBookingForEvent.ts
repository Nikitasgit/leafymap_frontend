import { useCallback, useEffect, useState } from "react";
import axios from "axios";
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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/event-bookings/event/${eventId}/me`,
        { withCredentials: true }
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

