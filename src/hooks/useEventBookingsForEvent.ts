import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { EventBookingWithUser } from "@/types/eventBooking";

export const useEventBookingsForEvent = (eventId?: string) => {
  const [eventBookings, setEventBookings] = useState<EventBookingWithUser[]>(
    []
  );
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  const fetchEventBookings = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/event-bookings/event/${eventId}`,
        { withCredentials: true }
      );

      if (response.data && response.data.data) {
        setEventBookings(response.data.data);
      } else {
        setEventBookings([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des réservations";
      setEventBookings([]);
      showError(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      withLoading(fetchEventBookings);
    } else {
      setEventBookings([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const refetch = useCallback(() => {
    if (eventId) {
      fetchEventBookings();
    }
  }, [eventId, fetchEventBookings]);

  return { eventBookings, isLoading, refetch };
};

