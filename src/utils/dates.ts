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
