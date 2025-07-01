import { useState, useCallback } from "react";
import axios from "axios";
import { Creator } from "@/types/user";

interface CreatorSearchResult {
  _id: string;
  name: string;
  image: string;
}

export const useFindCreators = () => {
  const [searchResults, setSearchResults] = useState<CreatorSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchCreators = useCallback(
    async (query: string): Promise<CreatorSearchResult[]> => {
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
          }/api/users/find-creators?name=${encodeURIComponent(query)}&limit=5`
        );
        const data = res.data;

        const results = data.data.map((user: Creator) => ({
          _id: user._id,
          name: user.creatorProfile?.name,
          image: user.image || "https://i.pravatar.cc/40?img=3",
        }));
        setSearchResults(results);
        return results;
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
    searchCreators,
    clearResults,
  };
};
