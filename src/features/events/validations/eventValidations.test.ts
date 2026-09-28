import { describe, expect, it } from "vitest";
import { tStub } from "@/test/tStub";
import type { Period } from "@/features/places/types/schedule";
import type { initialEventData } from "../components/eventForm/EventForm.types";
import { createValidateEventData } from "./eventValidations";

const validate = createValidateEventData(tStub);

const parisLocation = {
  type: "Point" as const,
  coordinates: [2.35, 48.85] as [number, number],
  label: "Paris",
};

const aPeriod = { startDate: "01-01-2026" } as Period;

const validEvent = (
  overrides: Partial<initialEventData> = {}
): initialEventData => ({
  name: "Yoga",
  description: "A valid description",
  eventCategory: "workshop",
  schedule: [aPeriod],
  place: "place-1",
  location: null,
  online: false,
  isBookable: false,
  capacity: "",
  maxSeatsPerBooking: "",
  ...overrides,
});

describe("createValidateEventData", () => {
  it("accepts a valid offline event with a place", () => {
    const result = validate(validEvent());
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("accepts a valid offline event with a location", () => {
    const result = validate(
      validEvent({ place: null, location: parisLocation })
    );

    expect(result.isValid).toBe(true);
  });

  it("rejects a name that is too short", () => {
    const result = validate(validEvent({ name: "Yo" }));

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe("event.name.minLength");
  });

  it("rejects an empty schedule", () => {
    const result = validate(validEvent({ schedule: [] }));

    expect(result.isValid).toBe(false);
    expect(result.errors.schedule).toBe("event.schedule.minDates");
  });

  it("requires a place or location when the event is offline", () => {
    const result = validate(validEvent({ place: null, location: null }));

    expect(result.isValid).toBe(false);
    expect(result.errors.location).toBe("event.location.required");
  });

  it("does not require a place or location when the event is online", () => {
    const result = validate(
      validEvent({ online: true, place: null, location: null })
    );

    expect(result.isValid).toBe(true);
  });

  it("rejects a non-integer capacity when the event is bookable", () => {
    const result = validate(
      validEvent({
        isBookable: true,
        capacity: "1.5",
        maxSeatsPerBooking: "1",
      })
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.capacity).toBe("event.capacity.positiveInteger");
  });

  it("rejects a capacity below 1 when the event is bookable", () => {
    const result = validate(
      validEvent({
        isBookable: true,
        capacity: "0",
        maxSeatsPerBooking: "1",
      })
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.capacity).toBe("event.capacity.positiveInteger");
  });

  it("rejects a non-positive maxSeatsPerBooking when the event is bookable", () => {
    const result = validate(
      validEvent({
        isBookable: true,
        capacity: "10",
        maxSeatsPerBooking: "0",
      })
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.maxSeatsPerBooking).toBe(
      "event.maxSeatsPerBooking.positive"
    );
  });

  it("rejects maxSeatsPerBooking that exceeds capacity", () => {
    const result = validate(
      validEvent({
        isBookable: true,
        capacity: "5",
        maxSeatsPerBooking: "10",
      })
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.maxSeatsPerBooking).toBe(
      "event.maxSeatsPerBooking.exceedsCapacity"
    );
  });

  it("ignores capacity and maxSeatsPerBooking when the event is not bookable", () => {
    const result = validate(
      validEvent({
        isBookable: false,
        capacity: "0",
        maxSeatsPerBooking: "99",
      })
    );

    expect(result.isValid).toBe(true);
  });

  it("accepts a bookable event with valid seat limits", () => {
    const result = validate(
      validEvent({
        isBookable: true,
        capacity: "20",
        maxSeatsPerBooking: "4",
      })
    );

    expect(result.isValid).toBe(true);
  });
});
