import { describe, expect, it } from "vitest";
import { getBookingLimits } from "./bookingLimits";

describe("getBookingLimits", () => {
  it("uses maxSeatsPerBooking when remaining seats are unknown", () => {
    const limits = getBookingLimits({
      maxSeatsPerBooking: 5,
      remainingSeats: null,
      lifecycleStatus: "upcoming",
    });

    expect(limits).toEqual({
      maxSelectable: 5,
      maxEditable: 5,
      canEdit: true,
      isFull: false,
    });
  });

  it("caps selectable seats at the remaining seats", () => {
    const limits = getBookingLimits({
      maxSeatsPerBooking: 5,
      remainingSeats: 2,
      lifecycleStatus: "upcoming",
    });

    expect(limits.maxSelectable).toBe(2);
    expect(limits.isFull).toBe(false);
  });

  it("marks the event as full when no seats remain", () => {
    const limits = getBookingLimits({
      maxSeatsPerBooking: 5,
      remainingSeats: 0,
      lifecycleStatus: "upcoming",
    });

    expect(limits.isFull).toBe(true);
    expect(limits.maxSelectable).toBe(1);
  });

  it("keeps the current booking when editing would otherwise drop below it", () => {
    const limits = getBookingLimits({
      maxSeatsPerBooking: 3,
      remainingSeats: 1,
      currentBookingSeats: 4,
      lifecycleStatus: "upcoming",
    });

    expect(limits.maxEditable).toBe(4);
  });

  it("caps editable seats at remaining plus the current booking", () => {
    const limits = getBookingLimits({
      maxSeatsPerBooking: 8,
      remainingSeats: 1,
      currentBookingSeats: 2,
      lifecycleStatus: "upcoming",
    });

    expect(limits.maxEditable).toBe(3);
  });

  it("closes edits when bookings are not open", () => {
    const limits = getBookingLimits({
      maxSeatsPerBooking: 5,
      remainingSeats: 4,
      lifecycleStatus: "completed",
    });

    expect(limits.canEdit).toBe(false);
  });
});
