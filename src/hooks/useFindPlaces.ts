import { useState, useCallback } from "react";
import axios from "axios";
import { useToast } from "./useToast";
import { useLoading } from "./useLoading";

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
  const { showError } = useToast();
  const { isLoading, withLoading } = useLoading();

  const searchPlaces = useCallback(
    async (query: string): Promise<PlaceSearchResult[]> => {
      if (!query || query.length < 2) {
        setSearchResults([]);
        return [];
      }

      return withLoading(async () => {
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
          const error =
            err instanceof Error ? err : new Error("Failed to search places");
          showError(error.message);
          console.error("Error searching places:", err);
          setSearchResults([]);
          return [];
        }
      });
    },
    [showError]
  );

  const clearResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  return {
    searchResults,
    isLoading,
    searchPlaces,
    clearResults,
  };
};
