import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useCreateEventBooking = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();
  const { t } = useTranslation("events");

  const createEventBooking = async (eventId: string, seats: number) => {
    try {
      const response = await withLoading(() =>
        apiClient.post(
          `/api/event-bookings/event/${eventId}`,
          { seats },
          {
            headers: { "Content-Type": "application/json" }
          }
        )
      );
      showSuccess(t("createEventBooking.success"));
      return response.data.data;
    } catch (err) {
      showError(
        getErrorMessage(err, t, t("createEventBooking.error"))
      );
      throw err;
    }
  };

  return { createEventBooking, isLoading };
};
