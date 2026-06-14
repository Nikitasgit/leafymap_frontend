import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { isTempId } from "@/utils/tempId";
import { parseDateToUTC } from "@/utils/dates";
import { Event } from "@/types/place/event";

const useSubmitEvent = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();

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
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/events`;
      const response = await withLoading(() =>
        axios[method](url, payload, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
      );
      return response.data.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        if (err.response.data.data) {
          Object.values(err.response.data.data).forEach((error: unknown) => {
            if (Array.isArray(error)) {
              error.forEach((e: string) => {
                showError(e);
              });
            } else if (typeof error === "string") {
              showError(error);
            }
          });
        } else {
          showError(err.response.data.message);
        }
      } else {
        showError("Une erreur inattendue s'est produite");
      }
      throw err;
    }
  };

  return { submitEvent, isLoading };
};

export default useSubmitEvent;
