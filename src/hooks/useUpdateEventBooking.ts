import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useUpdateEventBooking = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();
  const { t } = useTranslation("events");

  const updateEventBooking = async (bookingId: string, seats: number) => {
    try {
      const response = await withLoading(() =>
        apiClient.put(
          `/api/event-bookings/${bookingId}`,
          { seats },
          {
            headers: { "Content-Type": "application/json" }
          }
        )
      );
      showSuccess(t("updateEventBooking.success"));
      return response.data.data;
    } catch (err) {
      showError(
        getErrorMessage(err, t, t("updateEventBooking.error"))
      );
      throw err;
    }
  };

  return { updateEventBooking, isLoading };
};
