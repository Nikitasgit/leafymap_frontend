import { useState, useCallback } from "react";
import axios from "axios";

interface CreatorInPlacesResult {
  user: {
    _id: string;
    creatorProfile: {
      name: string;
      categories: Array<{
        _id: string;
        name: string;
      }>;
      place: {
        _id: string;
        location: {
          type: string;
          coordinates: number[];
          label: string;
          id: string;
        };
      };
    };
    image: string;
  };
  places: Array<{
    place: {
      _id: string;
      name: string;
      location: {
        type: string;
        coordinates: number[];
        label: string;
        id: string;
      };
      image: string;
    };
    events: Array<{
      _id: string;
      name: string;
      placeId: string;
      image: string;
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
