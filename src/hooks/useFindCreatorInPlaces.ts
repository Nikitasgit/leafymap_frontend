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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<CreatorInPlacesResult | null>(null);
  const findCreatorInPlaces = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/creator-in-places-and-events`,
        {
          params: {
            userId,
          },
        }
      );

      const results = response.data.data;
      console.log("Creator in places search results:", results);
      setData(results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to find creator in places")
      );
      console.error("Failed to find creator in places:", err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    findCreatorInPlaces,
  };
};
