import { useTranslation } from "react-i18next";
import {
  getBookingLimits,
  type BookingLimitsParams,
} from "../utils/bookingLimits";

export type UseBookingLimitsParams = BookingLimitsParams;

export function useBookingLimits(params: UseBookingLimitsParams) {
  const { t } = useTranslation("events");
  const limits = getBookingLimits(params);

  return {
    ...limits,
    lockedMessage: t("bookingLimits.lockedMessage"),
    lockedParticipationMessage: t("bookingLimits.lockedParticipationMessage"),
    closedMessage: t("bookingLimits.closedMessage"),
    fullMessage: t("bookingLimits.fullMessage"),
  };
}
