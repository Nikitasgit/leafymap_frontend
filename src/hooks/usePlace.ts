import { useState, useEffect } from "react";
import axios from "axios";
import { Place } from "@/types/place";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const usePlace = (
  placeId: string | null,
  enrichSchedule: boolean = false
) => {
  const [place, setPlace] = useState<Place | null>(null);
  const { isLoading, withLoading, stopLoading } = useLoading(true);
  const { showError } = useToast();
  console.log("placeId", placeId);
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const url = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/places/${placeId}?enrichSchedule=${enrichSchedule.toString()}`;

        const response = await axios.get(url);

        if (response.data && response.data.data) {
          setPlace(response.data.data);
        } else {
          setPlace(null);
          showError("Invalid response from server");
        }
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
    } else {
      setPlace(null);
      stopLoading();
    }
  }, [placeId, enrichSchedule]);

  return { place, isLoading };
};
