import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { MyEventBooking } from "@/types/eventBooking";

export const useMyEventBookings = () => {
  const [eventBookings, setEventBookings] = useState<MyEventBooking[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  const fetchMyEventBookings = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/event-bookings/me`,
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
          : "Erreur lors du chargement de vos réservations";
      setEventBookings([]);
      showError(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    withLoading(fetchMyEventBookings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = useCallback(() => {
    fetchMyEventBookings();
  }, [fetchMyEventBookings]);

  return { eventBookings, isLoading, refetch };
};

