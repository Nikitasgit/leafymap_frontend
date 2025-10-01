import { useCallback } from "react";
import { format } from "date-fns";
import { EventTimeSlot, Period } from "@/types/place/schedule";
import type { initialEventData } from "@/components/account/Event/EventForm/EventForm.types";

interface UseEventScheduleProps {
  setEvent: React.Dispatch<React.SetStateAction<initialEventData>>;
}

interface UseEventScheduleReturn {
  onUpdatePeriod: (
    periodId: string,
    startDate: Date,
    endDate: Date | null
  ) => void;
  onDeletePeriod: (periodId: string) => void;
  onUpdateTimeSlot: (periodId: string, timeSlot: EventTimeSlot) => void;
  onDeleteTimeSlot: (periodId: string, timeSlotId: string) => void;
}

export const useEventSchedule = ({
  setEvent,
}: UseEventScheduleProps): UseEventScheduleReturn => {
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
            : period
        ),
      }));
    },
    [setEvent]
  );

  const onDeletePeriod = useCallback(
    (periodId: string) => {
      if (
        confirm("Tous les créneaux de cette période seront également supprimés")
      ) {
        setEvent((prev: initialEventData) => ({
          ...prev,
          schedule: prev.schedule.filter(
            (period: Period) => period._id !== periodId
          ),
        }));
      }
    },
    [setEvent]
  );

  /**
   * Updates or adds a time slot within a period.
   * If the slot ID exists, it's updated; otherwise, it's added as a new slot.
   */
  const onUpdateTimeSlot = useCallback(
    (periodId: string, timeSlot: EventTimeSlot) => {
      setEvent((prev: initialEventData) => ({
        ...prev,
        schedule: prev.schedule.map((period: Period) =>
          period._id === periodId
            ? {
                ...period,
                timeSlots: period.timeSlots.some(
                  (slot: EventTimeSlot) => slot._id === timeSlot._id
                )
                  ? period.timeSlots.map((slot: EventTimeSlot) =>
                      slot._id === timeSlot._id ? timeSlot : slot
                    )
                  : [...period.timeSlots, timeSlot],
              }
            : period
        ),
      }));
    },
    [setEvent]
  );

  const onDeleteTimeSlot = useCallback(
    (periodId: string, timeSlotId: string) => {
      if (confirm("Voulez-vous vraiment supprimer ce créneau ?")) {
        setEvent((prev: initialEventData) => ({
          ...prev,
          schedule: prev.schedule.map((period: Period) =>
            period._id === periodId
              ? {
                  ...period,
                  timeSlots: period.timeSlots.filter(
                    (slot: EventTimeSlot) => slot._id !== timeSlotId
                  ),
                }
              : period
          ),
        }));
      }
    },
    [setEvent]
  );

  return {
    onUpdatePeriod,
    onDeletePeriod,
    onUpdateTimeSlot,
    onDeleteTimeSlot,
  };
};
