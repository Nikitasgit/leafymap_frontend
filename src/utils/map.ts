import { InitialPlaceData } from "@/components/account/CreateProfileStepper/CreateProfileStepper.types";
import { MapCoordinates, Location, MapboxFeature } from "@/types/common";
import { USER_MARKER } from "./constants";
import axios from "axios";

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
  creatorName: string,
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
  return {
    location,
    placeCategory: {
      name:
        typeof place.placeCategory === "string"
          ? place.placeCategory
          : place.placeCategory?.name ?? USER_MARKER.placeCategory.name,
    },
    name: creatorName || place.name || USER_MARKER.name,
    _id: "user-marker",
  };
};

/**
 * Reverse geocoding: converts coordinates to a human-readable address.
 * Uses Mapbox Geocoding API.
 */
export const getLocationFromCoordinates = async (coordinates: {
  latitude: number;
  longitude: number;
}): Promise<Location | null> => {
  const { latitude, longitude } = coordinates;
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`
    );
    const data = await res.json();

    if (data?.features?.length) {
      const place = data.features[0];
      const newLocation: Location = {
        type: "Point",
        label: place.place_name,
        coordinates: [longitude, latitude],
        id: place.id,
      };
      return newLocation;
    }
    return null;
  } catch (error) {
    console.error("Error fetching location data:", error);
    return null;
  }
};

/**
 * Forward geocoding: searches for places matching a text query.
 * Restricted to France (country: "fr") and returns French localized names.
 * Used for the address autocomplete input.
 */
export const fetchLocationSuggestions = async (
  input: string
): Promise<Location[]> => {
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      input
    )}.json`,
    {
      params: {
        access_token: mapboxAccessToken,
        country: "fr",
        language: "fr",
        limit: 5,
      },
    }
  );

  return response.data.features.map((feature: MapboxFeature) => ({
    type: "Point",
    id: feature.id,
    label: feature.place_name_fr || feature.place_name,
    coordinates: [feature.center[0], feature.center[1]],
  }));
};
