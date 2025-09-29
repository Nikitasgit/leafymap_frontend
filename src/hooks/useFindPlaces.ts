import { useState, useCallback } from "react";
import axios from "axios";
import { useToast } from "./useToast";
import { useLoading } from "./useLoading";
import { PlacePopulated } from "@/types/place";

export const useFindPlaces = () => {
  const [searchResults, setSearchResults] = useState<PlacePopulated[]>([]);
  const { showError } = useToast();
  const { isLoading, withLoading } = useLoading();

  const searchPlaces = useCallback(
    async (
      options: {
        name?: string;
        categoryId?: string;
        limit?: number;
      } = {}
    ): Promise<PlacePopulated[]> => {
      const { name, categoryId, limit = 10 } = options;

      if (name && name.length < 3) {
        setSearchResults([]);
        return [];
      }

      return withLoading(async () => {
        try {
          const params = new URLSearchParams();
          if (name) params.append("name", name);
          if (categoryId) params.append("categoryId", categoryId);
          params.append("limit", limit.toString());

          const res = await axios.get(
            `${
              process.env.NEXT_PUBLIC_API_URL
            }/api/places/search?${params.toString()}`
          );
          const results = res.data.data;
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
    [showError, withLoading]
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
