import { MapCoordinates } from "@/types/common";

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
