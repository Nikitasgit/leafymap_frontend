import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./useToast";
import { useLoading } from "./useLoading";

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

export const useFindCreatorInPlaces = (userId: string) => {
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const [data, setData] = useState<CreatorInPlacesResult | null>(null);

  useEffect(() => {
    const findCreatorInPlaces = async () => {
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
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des lieux";
        setData(null);
        showError(errorMessage);
      }
    };
    if (userId) {
      withLoading(findCreatorInPlaces);
    }
  }, [userId]);

  return {
    data,
    isLoading,
  };
};
