import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import useHandleApiErrors from "./useHandleApiErrors";
import { Place } from "@/types/place";
import { cleanIncompleteTimeSlots } from "@/utils/schedule";

const useSubmitPlace = () => {
  const { isLoading, withLoading } = useLoading();
  const { handleApiError } = useHandleApiErrors();

  const submitPlace = async (
    data: Partial<Place>,
    isUpdate: boolean = false,
    placeId?: string
  ) => {
    try {
      if (isUpdate && !placeId) {
        throw new Error("Place ID is required for update");
      }

      const cleanedData = {
        ...data,
        defaultSchedule: cleanIncompleteTimeSlots(data.defaultSchedule),
      };

      const method = isUpdate ? "put" : "post";
      const response = await withLoading(() =>
        apiClient[method](
          `/api/places/${
            isUpdate ? placeId : ""
          }`,
          cleanedData,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      );
      return response.data.data;
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  return { submitPlace, isLoading };
};

export default useSubmitPlace;
