import { DefaultSchedule, DaySchedule, TimeSlot } from "../types/schedule";

/**
 * Nettoie les timeslots incomplets (sans startTime ou endTime) d'un schedule
 */
export const cleanIncompleteTimeSlots = (
  schedule: DefaultSchedule | undefined,
): DefaultSchedule | undefined => {
  if (!schedule) return schedule;

  const cleanedSchedule: DefaultSchedule = {} as DefaultSchedule;

  (Object.keys(schedule) as Array<keyof DefaultSchedule>).forEach((day) => {
    const daySchedule: DaySchedule = schedule[day];
    const cleanedTimeSlots: TimeSlot[] = (daySchedule.timeSlots || []).filter(
      (slot) =>
        slot.startTime &&
        slot.endTime &&
        slot.startTime.trim() !== "" &&
        slot.endTime.trim() !== "",
    );

    cleanedSchedule[day] = {
      ...daySchedule,
      timeSlots: cleanedTimeSlots,
    };
  });

  return cleanedSchedule;
};
