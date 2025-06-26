import { useState, useCallback } from "react";
import axios from "axios";

interface PlaceSearchResult {
  _id: string;
  name: string;
  image?: string;
  location: {
    type: string;
    coordinates: number[];
    label: string;
    id: string;
  };
  placeCategory: {
    _id: string;
    name: string;
  };
}

export const useFindPlaces = () => {
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchPlaces = useCallback(
    async (query: string): Promise<PlaceSearchResult[]> => {
      if (!query || query.length < 2) {
        setSearchResults([]);
        return [];
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/places/search?name=${encodeURIComponent(query)}&limit=10`
        );
        const data = res.data;

        const results = data.data.map((place: PlaceSearchResult) => ({
          _id: place._id,
          name: place.name,
          image: place.image || "https://i.pravatar.cc/40?img=3",
          location: place.location,
          placeCategory: place.placeCategory,
        }));
        setSearchResults(results);
        return results;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to search places")
        );
        console.error("Error searching places:", err);
        setSearchResults([]);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    searchPlaces,
    clearResults,
  };
};
