import { areEventBookingsOpen } from "@/features/events/utils/constants";

export type BookingLimitsParams = {
  maxSeatsPerBooking: number;
  remainingSeats: number | null;
  currentBookingSeats?: number;
  lifecycleStatus: string;
};

export type BookingLimits = {
  maxSelectable: number;
  maxEditable: number;
  canEdit: boolean;
  isFull: boolean;
};

export function getBookingLimits({
  maxSeatsPerBooking,
  remainingSeats,
  currentBookingSeats,
  lifecycleStatus,
}: BookingLimitsParams): BookingLimits {
  const isFull = remainingSeats !== null && remainingSeats <= 0;
  const canEdit = areEventBookingsOpen(lifecycleStatus);

  const maxSelectable =
    remainingSeats === null
      ? maxSeatsPerBooking
      : Math.max(1, Math.min(maxSeatsPerBooking, remainingSeats));

  const maxEditable =
    remainingSeats === null || currentBookingSeats === undefined
      ? maxSeatsPerBooking
      : Math.max(
          currentBookingSeats,
          Math.min(maxSeatsPerBooking, remainingSeats + currentBookingSeats)
        );

  return {
    maxSelectable,
    maxEditable,
    canEdit,
    isFull,
  };
}
