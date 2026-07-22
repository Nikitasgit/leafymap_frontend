import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { isTempId } from "@/shared/utils/tempId";
import { parseDateToUTC } from "@/shared/utils/dates";
import { createEvent, updateEvent } from "../api/eventsApi";
import { Event } from "../types/event";

const useSubmitEvent = () => {
  const { mutate, isLoading } = useApiMutation(
    async (
      event: Partial<Event>,
      isUpdate: boolean = false,
      eventId?: string,
    ) => {
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
      return isUpdate
        ? updateEvent(eventId as string, payload)
        : createEvent(payload);
    },
    { rethrow: true },
  );

  return { submitEvent: mutate, isLoading };
};

export default useSubmitEvent;
