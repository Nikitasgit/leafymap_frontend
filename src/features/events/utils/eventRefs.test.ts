import { describe, expect, it } from "vitest";
import type { Place } from "@/features/places/types/place";
import type { Event } from "../types/event";
import {
  getEventCoordinates,
  getEventCreatorId,
  getEventLocation,
  getEventLocationLabel,
} from "./eventRefs";

const eventLocation = {
  type: "Point" as const,
  coordinates: [2.35, 48.85] as [number, number],
  label: "Event address",
};

const placeLocation = {
  type: "Point" as const,
  coordinates: [2.3, 48.8] as [number, number],
  label: "Place address",
};

const makeEvent = (overrides: Partial<Event> = {}): Event => ({
  id: "event-1",
  name: "Yoga",
  description: "A yoga session downtown",
  eventCategory: "cat-1",
  image: "img-1",
  schedule: [],
  partnerships: [],
  status: "available",
  lifecycleStatus: "upcoming",
  dateRange: { firstDate: "2026-01-01", latestDate: "2026-01-01" },
  rating: 0,
  ...overrides,
});

const makePlace = (overrides: Partial<Place> = {}): Place => ({
  id: "place-1",
  name: "Studio",
  description: "A studio",
  user: "place-owner",
  location: placeLocation,
  placeCategory: "cat",
  categories: [],
  defaultSchedule: {} as Place["defaultSchedule"],
  email: "",
  phone: "",
  website: "",
  active: true,
  rating: 0,
  followers: [],
  ...overrides,
});

describe("getEventCreatorId", () => {
  it("reads the creator from a string user id", () => {
    expect(getEventCreatorId(makeEvent({ user: "user-1" }))).toBe("user-1");
  });

  it("reads the creator from a populated user", () => {
    expect(
      getEventCreatorId(
        makeEvent({
          user: {
            id: "user-1",
            email: "user@example.com",
            username: "leafy",
            userType: "creator",
            phone: "",
            website: "",
            description: "",
          },
        })
      )
    ).toBe("user-1");
  });

  it("falls back to the place owner when the event has no user", () => {
    expect(
      getEventCreatorId(makeEvent({ place: makePlace({ user: "place-owner" }) }))
    ).toBe("place-owner");
  });

  it("returns null when the place is only an id", () => {
    expect(getEventCreatorId(makeEvent({ place: "place-1" }))).toBeNull();
  });
});

describe("getEventLocation", () => {
  it("prefers the event location over the place location", () => {
    expect(
      getEventLocation(
        makeEvent({
          location: eventLocation,
          place: makePlace(),
        })
      )
    ).toEqual({ lat: 48.85, lng: 2.35 });
  });

  it("falls back to the place location", () => {
    expect(getEventLocation(makeEvent({ place: makePlace() }))).toEqual({
      lat: 48.8,
      lng: 2.3,
    });
  });

  it("returns null without coordinates", () => {
    expect(getEventLocation(makeEvent())).toBeNull();
  });
});

describe("getEventCoordinates", () => {
  it("returns [lng, lat] from the resolved location", () => {
    expect(
      getEventCoordinates(makeEvent({ location: eventLocation }))
    ).toEqual([2.35, 48.85]);
  });
});

describe("getEventLocationLabel", () => {
  it("prefers the event location label", () => {
    expect(
      getEventLocationLabel(
        makeEvent({
          location: eventLocation,
          place: makePlace(),
        })
      )
    ).toBe("Event address");
  });

  it("falls back to the place location label", () => {
    expect(getEventLocationLabel(makeEvent({ place: makePlace() }))).toBe(
      "Place address"
    );
  });
});
