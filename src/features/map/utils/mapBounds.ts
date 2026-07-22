import type { LngLatBoundsLike } from "mapbox-gl";

/**
 * Computes a bounding box that contains all the given coordinates.
 * Returns `null` if the array is empty.
 *
 * @param coords Array of [longitude, latitude] pairs
 * @returns [[swLng, swLat], [neLng, neLat]] or null
 */
export const computeBounds = (
  coords: [number, number][]
): LngLatBoundsLike | null => {
  if (coords.length === 0) return null;

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
};
