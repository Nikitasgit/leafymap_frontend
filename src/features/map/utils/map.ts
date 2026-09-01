import type { InitialPlaceData } from "@/features/account";
import { MapCoordinates, Location } from "@/shared/types/common";
import { USER_MARKER } from "./constants";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";
import { request } from "@/shared/api/client";

/**
 * Converts pixel offset to geographic coordinates offset.
 * Used to shift the map center so that markers don't get hidden behind UI elements.
 *
 * @param coords - Original coordinates
 * @param offsetX - Horizontal pixel offset (positive = east)
 * @param offsetY - Vertical pixel offset (positive = south)
 * @returns Adjusted coordinates
 */
export const applyPixelOffsetToLocation = (
  coords: MapCoordinates,
  offsetX: number,
  offsetY: number
): MapCoordinates => {
  const zoom = 15;
  const pixelsPerDegree = (Math.pow(2, zoom) * 256) / 360;
  const longitudeOffset = offsetX / pixelsPerDegree;
  const latitudeOffset = -offsetY / pixelsPerDegree;

  return {
    latitude: coords.latitude + latitudeOffset,
    longitude: coords.longitude + longitudeOffset,
    zoom: coords.zoom,
  };
};

/**
 * Builds a temporary marker for the user's place during creation/editing.
 * Falls back through: place location -> user geolocation -> default marker location.
 */
export const buildUserMarker = (
  place: InitialPlaceData,
  username: string,
  userLocation?: { latitude: number; longitude: number }
) => {
  let location;
  if (place.location) {
    location = place.location;
  } else if (userLocation) {
    location = {
      coordinates: [userLocation.longitude, userLocation.latitude],
    };
  } else {
    location = USER_MARKER.location;
  }
  const placeCategoryObject = resolveRefObject(place.placeCategory);
  return {
    location,
    placeCategory: {
      name: placeCategoryObject
        ? placeCategoryObject.name ?? USER_MARKER.placeCategory.name
        : typeof place.placeCategory === "string"
          ? place.placeCategory
          : USER_MARKER.placeCategory.name,
    },
    name: username || USER_MARKER.name,
    id: "user-marker",
  };
};

/**
 * Reverse geocoding: converts coordinates to a human-readable address.
 */
export const getLocationFromCoordinates = async (coordinates: {
  latitude: number;
  longitude: number;
}): Promise<Location | null> => {
  const { latitude, longitude } = coordinates;

  try {
    const location = await request<Location | null>({
      method: "GET",
      url: "/api/geocode/reverse",
      params: { lng: longitude, lat: latitude },
    });
    return location;
  } catch (error) {
    console.error("Error fetching location data:", error);
    return null;
  }
};

/**
 * Forward geocoding: searches for places matching a text query.
 * Restricted to France and returns French localized names.
 */
export const fetchLocationSuggestions = async (
  input: string
): Promise<Location[]> => {
  const data = await request<Location[]>({
    method: "GET",
    url: "/api/geocode/suggest",
    params: { q: input },
  });
  return Array.isArray(data) ? data : [];
};
