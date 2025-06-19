import { useState } from "react";
import axios from "axios";
import { Place } from "@/types/place";

interface MapFilters {
  type?: string;
  category?: string;
}

interface UsePlacesInViewProps {
  filters?: MapFilters;
}

export const usePlacesInView = ({ filters }: UsePlacesInViewProps = {}) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlacesInView = async (bounds: mapboxgl.LngLatBounds | null) => {
    if (!bounds) return;

    setIsLoading(true);
    setError(null);

    const ne = bounds.getNorthEast().toArray();
    const sw = bounds.getSouthWest().toArray();

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
        err instanceof Error ? err : new Error("Failed to fetch places in view")
      );
      console.error("Failed to fetch places in view:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    places,
    isLoading,
    error,
    fetchPlacesInView,
  };
};
