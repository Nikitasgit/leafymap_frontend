import { describe, expect, it } from "vitest";
import {
  formatDateShort,
  formatEventDateRange,
  formatEventDateRangeCard,
  parseDateStringToDate,
  parseDateToUTC,
  sortPeriodsByStartDate,
} from "./dates";

describe("parseDateToUTC", () => {
  it("parses dd-MM-yyyy as a UTC midnight ISO string", () => {
    expect(parseDateToUTC("15-01-2024")).toBe("2024-01-15T00:00:00.000Z");
  });
});

describe("parseDateStringToDate", () => {
  it("parses dd-MM-yyyy as a UTC Date", () => {
    const date = parseDateStringToDate("15-01-2024");

    expect(date.toISOString()).toBe("2024-01-15T00:00:00.000Z");
  });
});

describe("formatDateShort", () => {
  it("formats as dd/MM", () => {
    expect(formatDateShort("2024-06-15T12:00:00.000Z")).toBe("15/06");
  });
});

describe("sortPeriodsByStartDate", () => {
  it("sorts without mutating the original array", () => {
    const periods = [
      { startDate: "2024-03-01", id: "b" },
      { startDate: "2024-01-01", id: "a" },
    ];

    expect(sortPeriodsByStartDate(periods).map((period) => period.id)).toEqual([
      "a",
      "b",
    ]);
    expect(periods[0].id).toBe("b");
  });
});

describe("formatEventDateRange", () => {
  it("returns an empty string without a first date", () => {
    expect(
      formatEventDateRange({
        firstDate: "",
        latestDate: "",
      }),
    ).toBe("");
  });

  it("formats a single day", () => {
    expect(
      formatEventDateRange({
        firstDate: "2024-01-15T00:00:00.000Z",
        latestDate: "2024-01-15T00:00:00.000Z",
      }),
    ).toBe("15 janv. 2024");
  });

  it("formats a range", () => {
    expect(
      formatEventDateRange({
        firstDate: "2024-01-15T00:00:00.000Z",
        latestDate: "2024-01-20T00:00:00.000Z",
      }),
    ).toBe("15 janv. 2024 - 20 janv. 2024");
  });
});

describe("formatEventDateRangeCard", () => {
  it("formats a single day with Du", () => {
    expect(
      formatEventDateRangeCard({
        firstDate: "2024-01-15T00:00:00.000Z",
        latestDate: "2024-01-15T00:00:00.000Z",
      }),
    ).toBe("Du 15/01/24");
  });

  it("formats a range with Du … au", () => {
    expect(
      formatEventDateRangeCard({
        firstDate: "2024-01-15T00:00:00.000Z",
        latestDate: "2024-01-20T00:00:00.000Z",
      }),
    ).toBe("Du 15/01/24 au 20/01/24");
  });
});
