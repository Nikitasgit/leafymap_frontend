import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import useHandleApiErrors from "./useHandleApiErrors";
import { isTempId } from "@/utils/tempId";
import { parseDateToUTC } from "@/utils/dates";
import { Event } from "@/types/place/event";

const useSubmitEvent = () => {
  const { isLoading, withLoading } = useLoading();
  const { handleApiError } = useHandleApiErrors();

  const submitEvent = async (
    event: Partial<Event>,
    isUpdate: boolean = false,
    eventId?: string
  ) => {
    try {
      if (isUpdate && !eventId) {
        throw new Error("Event ID is required for update");
      }
      const payload = {
        ...event,
        schedule: event.schedule?.map((period) => ({
          ...period,
          startDate: parseDateToUTC(period.startDate),
          endDate: period.endDate
            ? parseDateToUTC(period.endDate)
            : parseDateToUTC(period.startDate),
          _id: isTempId(period._id) ? undefined : period._id,
          timeSlots: period.timeSlots?.map((slot) => ({
            ...slot,
            _id: isTempId(slot._id) ? undefined : slot._id,
            collaborators: slot.collaborators?.map((collaborator) => ({
              _id: collaborator._id,
            })),
          })),
        })),
      };
      const method = isUpdate ? "put" : "post";
      const url = isUpdate
        ? `/api/events/${eventId}`
        : `/api/events`;
      const response = await withLoading(() =>
        apiClient[method](url, payload, {
          headers: {
            "Content-Type": "application/json",
          }
        })
      );
      return response.data.data;
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
      throw err;
    }
  };

  return { submitEvent, isLoading };
};

export default useSubmitEvent;
