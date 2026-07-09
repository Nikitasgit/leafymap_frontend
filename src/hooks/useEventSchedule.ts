import { useCallback } from "react";
import { format } from "date-fns";
import { EventTimeSlot, Period } from "@/types/place/schedule";
import type { initialEventData } from "@/components/account/Event/EventForm/EventForm.types";
import { useTranslation } from "react-i18next";

interface UseEventScheduleProps {
  setEvent: React.Dispatch<React.SetStateAction<initialEventData>>;
}

interface UseEventScheduleReturn {
  onUpdatePeriod: (
    periodId: string,
    startDate: Date,
    endDate: Date | null,
  ) => void;
  onDeletePeriod: (periodId: string) => void;
  onUpdateTimeSlot: (periodId: string, timeSlot: EventTimeSlot) => void;
  onDeleteTimeSlot: (periodId: string, timeSlotId: string) => void;
}

export const useEventSchedule = ({
  setEvent,
}: UseEventScheduleProps): UseEventScheduleReturn => {
  const { t } = useTranslation("events");

  const onUpdatePeriod = useCallback(
    (periodId: string, startDate: Date, endDate: Date | null) => {
      setEvent((prev: initialEventData) => ({
        ...prev,
        schedule: prev.schedule.map((period: Period) =>
          period._id === periodId
            ? {
                ...period,
                startDate: format(startDate, "dd-MM-yyyy"),
                endDate: endDate ? format(endDate, "dd-MM-yyyy") : "",
              }
            : period,
        ),
      }));
    },
    [setEvent],
  );

  const onDeletePeriod = useCallback(
    (periodId: string) => {
      if (confirm(t("useEventSchedule.deletePeriodConfirm"))) {
        setEvent((prev: initialEventData) => ({
          ...prev,
          schedule: prev.schedule.filter(
            (period: Period) => period._id !== periodId,
          ),
        }));
      }
    },
    [setEvent, t],
  );

  const onUpdateTimeSlot = useCallback(
    (periodId: string, timeSlot: EventTimeSlot) => {
      setEvent((prev: initialEventData) => ({
        ...prev,
        schedule: prev.schedule.map((period: Period) =>
          period._id === periodId
            ? {
                ...period,
                timeSlots: period.timeSlots.some(
                  (slot: EventTimeSlot) => slot._id === timeSlot._id,
                )
                  ? period.timeSlots.map((slot: EventTimeSlot) =>
                      slot._id === timeSlot._id ? timeSlot : slot,
                    )
                  : [...period.timeSlots, timeSlot],
              }
            : period,
        ),
      }));
    },
    [setEvent],
  );

  const onDeleteTimeSlot = useCallback(
    (periodId: string, timeSlotId: string) => {
      if (confirm(t("useEventSchedule.deleteTimeSlotConfirm"))) {
        setEvent((prev: initialEventData) => ({
          ...prev,
          schedule: prev.schedule.map((period: Period) =>
            period._id === periodId
              ? {
                  ...period,
                  timeSlots: period.timeSlots.filter(
                    (slot: EventTimeSlot) => slot._id !== timeSlotId,
                  ),
                }
              : period,
          ),
        }));
      }
    },
    [setEvent, t],
  );

  return {
    onUpdatePeriod,
    onDeletePeriod,
    onUpdateTimeSlot,
    onDeleteTimeSlot,
  };
};
