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
          id: isTempId(period.id) ? undefined : period.id,
          timeSlots: period.timeSlots?.map((slot) => ({
            ...slot,
            id: isTempId(slot.id) ? undefined : slot.id,
            collaborators: slot.collaborators?.map((collaborator) => ({
              id: collaborator.id,
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
