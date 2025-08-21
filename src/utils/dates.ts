import { parse } from "date-fns";

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
