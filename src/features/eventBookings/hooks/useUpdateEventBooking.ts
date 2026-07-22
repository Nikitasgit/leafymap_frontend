import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { updateEventBooking as updateEventBookingRequest } from "../api/eventBookingsApi";

export const useUpdateEventBooking = () => {
  const { t } = useTranslation("events");
  const { mutate, isLoading } = useApiMutation(
    async (bookingId: string, seats: number) =>
      updateEventBookingRequest(bookingId, seats),
    { successMessage: t("updateEventBooking.success"), rethrow: true },
  );

  return { updateEventBooking: mutate, isLoading };
};
