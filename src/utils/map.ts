import { InitialPlaceData } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { MapCoordinates } from "@/types/common";
import { USER_MARKER } from "./constants";

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
