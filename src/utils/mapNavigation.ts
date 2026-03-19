import { ExtendedMapRef } from "@/types/map";
import { applyPixelOffsetToLocation } from "@/utils/map";

interface MapNavigationParams {
  mapRef: React.RefObject<ExtendedMapRef | null> | undefined;
  placeId: string;
  coordinates: number[]; // [longitude, latitude]
  pixelOffsetX?: number;
  pixelOffsetY?: number;
  zoom?: number;
  duration?: number;
  boundsOffset?: number;
  skipFetchPlacesInView?: boolean;
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
  skipFetchPlacesInView = false,
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

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // On desktop: shift right to account for the 400px side card
  // On mobile: shift up to keep the marker above the bottom sheet (65% of viewport)
  const offsetLocation = isMobile
    ? applyPixelOffsetToLocation(
        { latitude, longitude },
        0,
        window.innerHeight * 0.08
      )
    : applyPixelOffsetToLocation(
        { latitude, longitude },
        pixelOffsetX,
        pixelOffsetY
      );

  const mapInstance = mapRef.current;
  mapInstance.setSelectedPlaceId(placeId);

  // Ne pas appeler fetchPlacesInView ici : onMoveEnd du Map fera le fetch après le flyTo,
  // évitant un double chargement (skeleton / loading plusieurs fois).

  mapRef.current.flyTo({
    center: [offsetLocation.longitude, offsetLocation.latitude],
    zoom,
    duration,
  });
};

// Open Google Maps with the destination
export const handleGetDirections = (coordinates: number[]) => {
  if (!coordinates) return;
  const [longitude, latitude] = coordinates;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  window.open(googleMapsUrl, "_blank");
};
