import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { MyEventBooking } from "@/types/eventBooking";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useMyEventBookings = () => {
  const [eventBookings, setEventBookings] = useState<MyEventBooking[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const { t } = useTranslation("events");

  const fetchMyEventBookings = useCallback(async () => {
    try {
      const response = await apiClient.get(
        `/api/event-bookings/me`,
        {}
      );

      if (response.data && response.data.data) {
        setEventBookings(response.data.data);
      } else {
        setEventBookings([]);
      }
    } catch (err) {
      showError(
        getErrorMessage(err, t, t("myEventBookings.loadError"))
      );
      setEventBookings([]);
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
