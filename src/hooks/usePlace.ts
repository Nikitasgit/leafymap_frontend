import { useState, useEffect } from "react";
import { PlacePopulated } from "@/types/place";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { getPlaceById } from "@/lib/api/places";

export const usePlace = (
  placeId: string | null,
  enrichSchedule: boolean = false
) => {
  const [place, setPlace] = useState<PlacePopulated | null>(null);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  useEffect(() => {
    const fetchPlace = async () => {
      if (!placeId) return;
      const place = await getPlaceById(placeId, enrichSchedule);
      if (typeof place === "string") {
        setPlace(null);
        showError(place);
      } else {
        setPlace(place);
      }
    };

    if (placeId) {
      withLoading(fetchPlace);
    }
  }, [placeId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { place, isLoading };
};
