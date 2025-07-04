import { useState, useEffect } from "react";
import axios from "axios";
import { Place } from "@/types/place";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const usePlace = (placeId: string, enrichSchedule: boolean = false) => {
  const [place, setPlace] = useState<Place | null>(null);
  const { isLoading, withLoading } = useLoading(true);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const url = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/places/${placeId}?enrichSchedule=${enrichSchedule.toString()}`;
        const response = await axios.get(url);
        setPlace(response.data.data);
        showSuccess("Lieu chargé avec succès");
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement du lieu";
        setPlace(null);
        showError(errorMessage);
      }
    };

    if (placeId) {
      withLoading(fetchPlace);
    }
  }, [placeId]);

  return { place, loading: isLoading };
};
