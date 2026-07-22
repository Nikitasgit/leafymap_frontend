import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { createPlace, updatePlace } from "../api/placesApi";
import { Place } from "../types/place";
import { cleanIncompleteTimeSlots } from "../utils/schedule";

const useSubmitPlace = () => {
  const { mutate, isLoading } = useApiMutation(
    async (
      data: Partial<Place>,
      isUpdate: boolean = false,
      placeId?: string,
    ) => {
      if (isUpdate && !placeId) {
        throw new Error("Place ID is required for update");
      }

      const cleanedData = {
        ...data,
        defaultSchedule: cleanIncompleteTimeSlots(data.defaultSchedule),
      };

      return isUpdate
        ? updatePlace(placeId as string, cleanedData)
        : createPlace(cleanedData);
    },
  );

  return { submitPlace: mutate, isLoading };
};

export default useSubmitPlace;
