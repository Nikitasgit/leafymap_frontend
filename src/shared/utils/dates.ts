import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";

export function parseDateToUTC(dateString: string): string {
  const parsedDate = parse(dateString, "dd-MM-yyyy", new Date());

  const utcDate = new Date(
    Date.UTC(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
      0,
      0,
      0,
      0
    )
  );

  return utcDate.toISOString();
}

export function parseDateStringToDate(dateString: string): Date {
  const parsedDate = parse(dateString, "dd-MM-yyyy", new Date());

  const utcDate = new Date(
    Date.UTC(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
      0,
      0,
      0,
      0
    )
  );

  return utcDate;
}

export const formatDateShort = (dateString: string): string => {
  return format(new Date(dateString), "dd/MM", {
    locale: fr,
  });
};

export const sortPeriodsByStartDate = <T extends { startDate: string }>(
  periods: T[]
): T[] => {
  return [...periods].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA.getTime() - dateB.getTime();
  });
};

/**
 * Formats an event date range for display.
 * @param dateRange - The date range object with firstDate and latestDate
 * @returns Formatted date string (e.g., "15 Jan 2024" or "15 Jan 2024 - 20 Jan 2024")
 */
export const formatEventDateRange = (dateRange: {
  firstDate: Date | string;
  latestDate: Date | string;
}): string => {
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

/**
 * Formats an event date range as "Du dd/MM/yy au dd/MM/yy" for suggestion cards.
 */
export const formatEventDateRangeCard = (dateRange: {
  firstDate: Date | string;
  latestDate: Date | string;
}): string => {
  if (!dateRange?.firstDate) return "";

  const first = format(new Date(dateRange.firstDate), "dd/MM/yy", {
    locale: fr,
  });

  if (!dateRange.latestDate || dateRange.latestDate === dateRange.firstDate) {
    return `Du ${first}`;
  }

  const latest = format(new Date(dateRange.latestDate), "dd/MM/yy", {
    locale: fr,
  });

  return `Du ${first} au ${latest}`;
};
