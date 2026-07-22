import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { cancelEventBooking as cancelEventBookingRequest } from "../api/eventBookingsApi";

export const useCancelEventBooking = () => {
  const { t } = useTranslation("events");
  const { mutate, isLoading } = useApiMutation(
    async (bookingId: string) => {
      await cancelEventBookingRequest(bookingId);
    },
    { successMessage: t("cancelEventBooking.success"), rethrow: true },
  );

  return { cancelEventBooking: mutate, isLoading };
};
