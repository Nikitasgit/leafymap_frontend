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
 * Navigates smoothly to a place on the map with optional pixel offset.
 * The offset is useful on desktop to keep the place card visible while centering the marker.
 * On mobile, no offset is applied since the card is overlayed.
 *
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

  // Detect if mobile (screen width < 768px for md breakpoint)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Apply offset only on desktop to accommodate the side card
  const offsetLocation = isMobile
    ? { latitude, longitude }
    : applyPixelOffsetToLocation(
        { latitude, longitude },
        pixelOffsetX,
        pixelOffsetY
      );

  const mapInstance = mapRef.current;
  mapInstance.setSelectedPlaceId(placeId);

  // Create a small bounding box around the target location
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
