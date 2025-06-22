import { useState, useCallback } from "react";
import axios from "axios";

interface CreatorInPlacesResult {
  places: Array<{
    placeId: string;
    placeName: string;
    collaborators: Array<{
      userId: string;
      userName: string;
      userImage: string | null;
    }>;
  }>;
  events: Array<{
    eventId: string;
    eventName: string;
    collaborators: Array<{
      userId: string;
      userName: string;
      userImage: string | null;
    }>;
  }>;
}

export const useFindCreatorInPlaces = () => {
  const [searchResults, setSearchResults] =
    useState<CreatorInPlacesResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const findCreatorInPlaces = useCallback(async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/places/search`,
        {
          params: {
            searchType: "members",
            search: searchTerm,
          },
        }
      );

      const results = response.data.data;
      console.log("Creator in places search results:", results);
      setSearchResults(results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to find creator in places")
      );
      console.error("Failed to find creator in places:", err);
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults(null);
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    findCreatorInPlaces,
    clearResults,
  };
};
