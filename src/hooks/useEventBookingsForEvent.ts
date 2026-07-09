import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { EventBookingWithUser } from "@/types/eventBooking";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useEventBookingsForEvent = (eventId?: string) => {
  const [eventBookings, setEventBookings] = useState<EventBookingWithUser[]>(
    []
  );
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const { t } = useTranslation("events");

  const fetchEventBookings = useCallback(async () => {
    try {
      const response = await apiClient.get(
        `/api/event-bookings/event/${eventId}`,
        {}
      );

      if (response.data && response.data.data) {
        setEventBookings(response.data.data);
      } else {
        setEventBookings([]);
      }
    } catch (err) {
      showError(
        getErrorMessage(err, t, t("eventBookingsForEvent.loadError"))
      );
      setEventBookings([]);
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
