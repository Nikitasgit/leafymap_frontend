import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchMyEventBookings } from "../api/eventBookingsApi";
import { MyEventBooking } from "../types/eventBooking";

export const useMyEventBookings = () => {
  const { t } = useTranslation("events");

  const {
    data: eventBookings,
    isLoading,
    refetch,
  } = useApiQuery<MyEventBooking[]>(() => fetchMyEventBookings(), {
    initialData: [],
    deps: [],
    errorMessage: t("myEventBookings.loadError"),
  });

  return { eventBookings, isLoading, refetch };
};
