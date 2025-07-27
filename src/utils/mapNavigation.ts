import { ExtendedMapRef } from "@/types/map";
import { applyPixelOffsetToLocation } from "@/utils/map";
import mapboxgl from "mapbox-gl";

interface MapNavigationParams {
  mapRef: React.RefObject<ExtendedMapRef | null> | undefined;
  placeId: string;
  coordinates: number[]; // [longitude, latitude]
  pixelOffsetX?: number;
  pixelOffsetY?: number;
  zoom?: number;
  duration?: number;
  boundsOffset?: number;
}

/**
 * Reusable function to navigate to a place on the map
 * @param params - Map navigation parameters
 */
export const navigateToPlaceOnMap = async ({
  mapRef,
  placeId,
  coordinates,
  pixelOffsetX = -100,
  pixelOffsetY = 0,
  zoom = 15,
  duration = 800,
  boundsOffset = 0.01,
}: MapNavigationParams): Promise<void> => {
  if (!mapRef?.current) {
    console.warn("Map reference is not available");
    return;
  }

  if (coordinates.length < 2) {
    console.warn("Invalid coordinates provided");
    return;
  }

  const [longitude, latitude] = coordinates;
  const offsetLocation = applyPixelOffsetToLocation(
    { latitude, longitude },
    pixelOffsetX,
    pixelOffsetY
  );

  const mapInstance = mapRef.current;
  mapInstance.setSelectedPlaceId(placeId);

  const bounds = new mapboxgl.LngLatBounds();
  bounds.extend([
    offsetLocation.longitude - boundsOffset,
    offsetLocation.latitude - boundsOffset,
  ]);
  bounds.extend([
    offsetLocation.longitude + boundsOffset,
    offsetLocation.latitude + boundsOffset,
  ]);

  await mapInstance.fetchPlacesInView(bounds);

  mapRef.current.flyTo({
    center: [offsetLocation.longitude, offsetLocation.latitude],
    zoom,
    duration,
  });
};
