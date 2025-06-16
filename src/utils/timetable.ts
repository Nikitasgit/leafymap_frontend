import { DaySchedule, TimeSlot } from "@/types/place/schedule";

export const getStrictExcludedTimes = (
  isStartTime: boolean,
  currentSlotIndex: number,
  schedule: DaySchedule
) => {
  const excludedTimes: Date[] = [];
  const currentSlot = schedule.timeSlots?.[currentSlotIndex];

  const otherSlots =
    schedule.timeSlots?.filter(
      (slot: TimeSlot, index: number) =>
        index !== currentSlotIndex && slot.startTime && slot.endTime
    ) || [];

  const toDate = (time: string) => new Date(`2000-01-01T${time}`);
  const generateTimes = (from: Date, to: Date) => {
    const times: Date[] = [];
    const time = new Date(from);
    while (time <= to) {
      times.push(new Date(time));
      time.setMinutes(time.getMinutes() + 10);
    }
    return times;
  };
  otherSlots.forEach((slot) => {
    const endTime = toDate(slot.endTime!);
    excludedTimes.push(endTime);
  });

  if (isStartTime) {
    if (currentSlot?.endTime) {
      const endDate = toDate(currentSlot.endTime);
      excludedTimes.push(endDate);

      const earlierSlots = otherSlots
        .filter((slot) => toDate(slot.endTime!) < endDate)
        .sort(
          (a, b) => toDate(b.endTime!).getTime() - toDate(a.endTime!).getTime()
        );

      if (earlierSlots.length > 0) {
        const latestEnd = toDate(earlierSlots[0].endTime!);
        excludedTimes.push(...generateTimes(toDate("00:00"), latestEnd));
      }
    }
    otherSlots.forEach((slot) => {
      const slotStart = new Date(`2000-01-01T${slot.startTime!}`);
      const tenMinutesBefore = new Date(slotStart.getTime() - 10 * 60 * 1000);
      excludedTimes.push(tenMinutesBefore);
    });
    otherSlots.forEach((slot) => {
      const slotStart = toDate(slot.startTime!);
      const slotEnd = toDate(slot.endTime!);

      excludedTimes.push(
        ...generateTimes(toDate("00:00"), toDate("23:59")).filter(
          (currentTime) =>
            (currentTime >= slotStart && currentTime < slotEnd) ||
            Math.abs(currentTime.getTime() - slotStart.getTime()) <
              10 * 60 * 1000
        )
      );
    });
  } else {
    if (currentSlot?.startTime) {
      const startDate = toDate(currentSlot.startTime);
      excludedTimes.push(startDate);

      const laterSlots = otherSlots
        .filter((slot) => toDate(slot.startTime!) > startDate)
        .sort(
          (a, b) =>
            toDate(a.startTime!).getTime() - toDate(b.startTime!).getTime()
        );

      if (laterSlots.length > 0) {
        const earliestStart = toDate(laterSlots[0].startTime!);
        excludedTimes.push(...generateTimes(earliestStart, toDate("23:59")));
      }
    }

    otherSlots.forEach((slot) => {
      const slotStart = toDate(slot.startTime!);
      const slotEnd = toDate(slot.endTime!);

      excludedTimes.push(
        ...generateTimes(toDate("00:00"), toDate("23:59")).filter(
          (currentTime) =>
            (currentTime > slotStart && currentTime <= slotEnd) ||
            Math.abs(currentTime.getTime() - slotEnd.getTime()) < 10 * 60 * 1000
        )
      );
    });
  }

  return excludedTimes;
};
