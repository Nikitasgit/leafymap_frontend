import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchPlaceById } from "../api/placesApi";
import { PlacePopulated } from "../types/place";

export const usePlace = (
  placeId: string | null,
  options?: { scheduleWithEvents?: boolean },
) => {
  const {
    data: place,
    isLoading,
    refetch,
  } = useApiQuery<PlacePopulated | null>(
    async () =>
      (await fetchPlaceById(placeId as string, {
        scheduleWithEvents: options?.scheduleWithEvents,
      })) as PlacePopulated,
    {
      initialData: null,
      enabled: !!placeId,
      deps: [placeId, options?.scheduleWithEvents],
      errorMessage: "Erreur lors du chargement du lieu",
    },
  );

  return { place, isLoading, refetch };
};
