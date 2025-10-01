import { Period } from "@/types/place/schedule";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EventDates {
  firstDate: string;
  latestDate: string;
}

interface EventDisplayInfo {
  status: "upcoming" | "ongoing" | "completed" | "unvalid";
  formattedDateRange: string;
  dateRange: EventDates;
}

/**
 * Extracts the earliest and latest dates from an event's schedule.
 * Events can have multiple periods, this finds the overall date range.
 */
export const getEventDateRange = (schedule: Period[]): EventDates => {
  if (!schedule || schedule.length === 0) {
    return { firstDate: "", latestDate: "" };
  }
  const allDates: string[] = [];
  schedule.forEach((period) => {
    if (period.startDate) {
      allDates.push(period.startDate);
    }
    if (period.endDate && period.endDate !== "") {
      allDates.push(period.endDate);
    }
  });
  if (allDates.length === 0) {
    return { firstDate: "", latestDate: "" };
  }
  if (allDates.length === 1) {
    return { firstDate: allDates[0], latestDate: "" };
  }
  const sortedDates = allDates.sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  return {
    firstDate: sortedDates[0],
    latestDate: sortedDates[sortedDates.length - 1],
  };
};

/**
 * Determines the current status of an event based on its schedule.
 * Compares the event's date range with today's date.
 */
export const getEventStatusFromSchedule = (
  schedule: Period[]
): "upcoming" | "ongoing" | "completed" | "unvalid" => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateRange = getEventDateRange(schedule);
  if (!dateRange.firstDate) {
    return "unvalid";
  }
  const firstDate = new Date(dateRange.firstDate);
  const latestDate = dateRange.latestDate
    ? new Date(dateRange.latestDate)
    : firstDate;
  firstDate.setHours(0, 0, 0, 0);
  latestDate.setHours(0, 0, 0, 0);
  if (firstDate <= today && today <= latestDate) {
    return "ongoing";
  }
  if (firstDate > today) {
    return "upcoming";
  }
  if (latestDate < today) {
    return "completed";
  }
  return "unvalid";
};

export const getEventDisplayInfo = (schedule: Period[]): EventDisplayInfo => {
  const status = getEventStatusFromSchedule(schedule);
  const dateRange = getEventDateRange(schedule);
  const formattedDateRange = formatEventDateRange(dateRange);

  return {
    status,
    formattedDateRange,
    dateRange,
  };
};

export const formatEventDateRange = (dateRange: EventDates): string => {
  if (!dateRange.firstDate) return "";

  const firstDate = format(new Date(dateRange.firstDate), "dd MMM yyyy", {
    locale: fr,
  });

  if (!dateRange.latestDate || dateRange.latestDate === dateRange.firstDate) {
    return firstDate;
  }

  const latestDate = format(new Date(dateRange.latestDate), "dd MMM yyyy", {
    locale: fr,
  });

  return `${firstDate} - ${latestDate}`;
};
