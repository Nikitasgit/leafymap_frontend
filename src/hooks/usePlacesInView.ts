import { useState, useCallback } from "react";
import axios from "axios";
import { Place } from "@/types/place";
import { MapFilters } from "@/types/map";
import { MapRef } from "react-map-gl/mapbox";

interface UsePlacesInViewProps {
  filters?: MapFilters;
}

export const usePlacesInView = ({ filters }: UsePlacesInViewProps = {}) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetches places within the visible map bounds.
   * Used to dynamically load places as the user pans/zooms the map.
   */
  const fetchPlacesInView = useCallback(
    async (
      bounds: mapboxgl.LngLatBounds | null,
      mapRef?: React.RefObject<MapRef>
    ) => {
      let currentBounds = bounds;
      if (!currentBounds && mapRef?.current) {
        try {
          currentBounds = mapRef.current.getBounds();
        } catch (err) {
          console.warn("Could not get current map bounds:", err);
          return;
        }
      }
      if (!currentBounds) {
        console.warn("No bounds provided and could not get current map bounds");
        return;
      }

      setIsLoading(true);
      setError(null);

      // Extract northeast and southwest corners for bounding box query
      const ne = currentBounds.getNorthEast().toArray();
      const sw = currentBounds.getSouthWest().toArray();

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/places/in-view`,
          {
            params: {
              ne: JSON.stringify(ne),
              sw: JSON.stringify(sw),
              filters: JSON.stringify(filters),
            },
          }
        );
        setPlaces(response.data.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch places in view")
        );
        console.error("Failed to fetch places in view:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  return {
    places,
    isLoading,
    error,
    fetchPlacesInView,
  };
};
