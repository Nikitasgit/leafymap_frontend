import type { Event } from "../types/event";
import type { Location } from "@/shared/types/common";
import {
  resolveRefId,
  resolveRefObject,
} from "@/shared/api/normalizers/resolveRef";

export function getEventCreatorId(event: Event): string | null {
  const userId = resolveRefId(event.user ?? null);
  if (userId) return userId;

  const place = resolveRefObject(event.place);
  if (place) {
    return resolveRefId(place.user ?? null);
  }

  return null;
}

export function getEventLocation(event: Event): { lat: number; lng: number } | null {
  const place = resolveRefObject(event.place);
  const location: Location | null | undefined =
    event.location ?? place?.location ?? null;

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
  const place = resolveRefObject(event.place);
  if (place?.location?.label) {
    return place.location.label;
  }
  return undefined;
}
