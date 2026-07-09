import type { Event } from "@/types/place/event";
import type { Location } from "@/types/common";

export function resolveRefId(
  ref: string | { _id: string } | null | undefined,
): string | null {
  if (ref == null) return null;
  if (typeof ref === "string") return ref;
  return ref._id ?? null;
}

export function getEventCreatorId(event: Event): string | null {
  const userId = resolveRefId(event.user ?? null);
  if (userId) return userId;

  if (typeof event.place === "object" && event.place) {
    return resolveRefId(event.place.user ?? null);
  }

  return null;
}

export function getEventLocation(event: Event): { lat: number; lng: number } | null {
  const location: Location | null | undefined =
    event.location ??
    (typeof event.place === "object" && event.place?.location
      ? event.place.location
      : null);

  if (!location?.coordinates) return null;

  const [lng, lat] = location.coordinates;
  return { lat, lng };
}

export function getEventCoordinates(event: Event): [number, number] | undefined {
  const location = getEventLocation(event);
  if (!location) return undefined;
  return [location.lng, location.lat];
}

export function getEventLocationLabel(event: Event): string | undefined {
  if (event.location?.label) return event.location.label;
  if (typeof event.place === "object" && event.place?.location?.label) {
    return event.place.location.label;
  }
  return undefined;
}
