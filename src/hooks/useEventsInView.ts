import { useState, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api/client";
import { Event } from "@/types/place/event";
import { MapFilters } from "@/types/map";
import { MapRef } from "react-map-gl/mapbox";

interface UseEventsInViewProps {
  filters?: MapFilters;
}

const DEBOUNCE_MS = 300;

export const useEventsInView = ({ filters }: UseEventsInViewProps = {}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchEventsInViewImmediate = useCallback(
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
          `/api/events/in-view`,
          {
            params: {
              ne: JSON.stringify(ne),
              sw: JSON.stringify(sw),
              filters: JSON.stringify(filters),
              limit: 100,
            },
          }
        );
        setEvents(response.data.data);
      } catch (err) {
        const fetchError =
          err instanceof Error
            ? err
            : new Error("Failed to fetch events in view");
        setError(fetchError);
        console.error("Failed to fetch events in view:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  const fetchEventsInView = useCallback(
    (
      bounds: mapboxgl.LngLatBounds | null,
      mapRef?: React.RefObject<MapRef>
    ) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        fetchEventsInViewImmediate(bounds, mapRef);
      }, DEBOUNCE_MS);
    },
    [fetchEventsInViewImmediate]
  );

  return {
    events,
    isLoading,
    error,
    fetchEventsInView,
  };
};
