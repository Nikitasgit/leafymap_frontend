import { describe, expect, it } from "vitest";
import { areEventBookingsOpen } from "./constants";

describe("areEventBookingsOpen", () => {
  it("is open for upcoming events", () => {
    expect(areEventBookingsOpen("upcoming")).toBe(true);
  });

  it("is open for ongoing events", () => {
    expect(areEventBookingsOpen("ongoing")).toBe(true);
  });

  it("is closed for completed events", () => {
    expect(areEventBookingsOpen("completed")).toBe(false);
  });

  it("is closed for unvalid events", () => {
    expect(areEventBookingsOpen("unvalid")).toBe(false);
  });

  it("is closed when the status is missing", () => {
    expect(areEventBookingsOpen(undefined)).toBe(false);
  });
});
