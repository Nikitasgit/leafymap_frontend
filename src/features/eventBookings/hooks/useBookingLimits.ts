import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { areEventBookingsOpen } from "@/features/events/utils/constants";

interface UseBookingLimitsParams {
  maxSeatsPerBooking: number;
  remainingSeats: number | null;
  currentBookingSeats?: number;
  lifecycleStatus: string;
}

export function useBookingLimits({
  maxSeatsPerBooking,
  remainingSeats,
  currentBookingSeats,
  lifecycleStatus,
}: UseBookingLimitsParams) {
  const { t } = useTranslation("events");

  const areBookingsOpen = areEventBookingsOpen(lifecycleStatus);
  const isFull = remainingSeats !== null && remainingSeats <= 0;
  const canEdit = areBookingsOpen;

  const maxSelectable = useMemo(() => {
    if (remainingSeats === null) return maxSeatsPerBooking;
    return Math.max(1, Math.min(maxSeatsPerBooking, remainingSeats));
  }, [remainingSeats, maxSeatsPerBooking]);

  const maxEditable = useMemo(() => {
    if (remainingSeats === null || currentBookingSeats === undefined) {
      return maxSeatsPerBooking;
    }
    return Math.max(
      currentBookingSeats,
      Math.min(maxSeatsPerBooking, remainingSeats + currentBookingSeats),
    );
  }, [remainingSeats, maxSeatsPerBooking, currentBookingSeats]);

  const lockedMessage = t("bookingLimits.lockedMessage");
  const lockedParticipationMessage = t("bookingLimits.lockedParticipationMessage");
  const closedMessage = t("bookingLimits.closedMessage");
  const fullMessage = t("bookingLimits.fullMessage");

  return {
    maxSelectable,
    maxEditable,
    canEdit,
    isFull,
    lockedMessage,
    lockedParticipationMessage,
    closedMessage,
    fullMessage,
  };
}
