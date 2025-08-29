import { useState, useCallback } from "react";
import axios from "axios";
import { User } from "@/types/user";

export const useFindCreators = () => {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const searchCreators = useCallback(async (query: string): Promise<User[]> => {
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
        }/api/users/find-creators?name=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = res.data.data;
      setSearchResults(data);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to search creators")
      );
      console.error("Error searching creators:", err);
      setSearchResults([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    searchCreators,
    clearResults,
  };
};
