import { useState, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api/client";
import { Place } from "@/types/place";
import { MapFilters } from "@/types/map";
import { MapRef } from "react-map-gl/mapbox";

interface UsePlacesInViewProps {
  filters?: MapFilters;
}

const DEBOUNCE_MS = 300;

export const usePlacesInView = ({ filters }: UsePlacesInViewProps = {}) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPlacesInViewImmediate = useCallback(
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

      const ne = currentBounds.getNorthEast().toArray();
      const sw = currentBounds.getSouthWest().toArray();

      try {
        const response = await apiClient.get(
          `/api/places/in-view`,
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
        const fetchError =
          err instanceof Error
            ? err
            : new Error("Failed to fetch places in view");
        setError(fetchError);
        console.error("Failed to fetch places in view:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  const fetchPlacesInView = useCallback(
    (
      bounds: mapboxgl.LngLatBounds | null,
      mapRef?: React.RefObject<MapRef>
    ) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        fetchPlacesInViewImmediate(bounds, mapRef);
      }, DEBOUNCE_MS);
    },
    [fetchPlacesInViewImmediate]
  );

  return {
    places,
    isLoading,
    error,
    fetchPlacesInView,
  };
};
