import { MapCoordinates } from "@/types/common";
import { MapRef } from "react-map-gl/mapbox";

export const applyPixelOffsetToLocation = (
  mapRef: React.RefObject<MapRef | null>,
  coords: MapCoordinates,
  offsetX: number,
  offsetY: number
): MapCoordinates => {
  if (!mapRef.current) return coords;

  const map = mapRef.current.getMap();
  const zoom = map.getZoom();

  const pixelsPerDegree = (Math.pow(2, zoom) * 256) / 360;

  const longitudeOffset = offsetX / pixelsPerDegree;
  const latitudeOffset = -offsetY / pixelsPerDegree;

  return {
    latitude: coords.latitude + latitudeOffset,
    longitude: coords.longitude + longitudeOffset,
    zoom: coords.zoom,
  };
};
