import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useCancelEventBooking = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();
  const { t } = useTranslation("events");

  const cancelEventBooking = async (bookingId: string) => {
    try {
      await withLoading(() =>
        apiClient.delete(
          `/api/event-bookings/${bookingId}`,
          {}
        )
      );
      showSuccess(t("cancelEventBooking.success"));
    } catch (err) {
      showError(
        getErrorMessage(err, t, t("cancelEventBooking.error"))
      );
      throw err;
    }
  };

  return { cancelEventBooking, isLoading };
};
