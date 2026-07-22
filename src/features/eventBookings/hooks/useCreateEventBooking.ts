import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { createEventBooking as createEventBookingRequest } from "../api/eventBookingsApi";

export const useCreateEventBooking = () => {
  const { t } = useTranslation("events");
  const { mutate, isLoading } = useApiMutation(
    async (eventId: string, seats: number) =>
      createEventBookingRequest(eventId, seats),
    { successMessage: t("createEventBooking.success"), rethrow: true },
  );

  return { createEventBooking: mutate, isLoading };
};
