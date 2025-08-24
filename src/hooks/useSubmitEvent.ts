import axios from "axios";
import { useParams } from "next/navigation";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { isTempId } from "@/utils/tempId";
import { parseDateToUTC } from "@/utils/dates";
import { initialEventData } from "@/components/events/form/EventForm/EventForm";

const useSubmitEvent = () => {
  const params = useParams();
  const placeId = params.placeId as string;
  const eventId = params.eventId as string;
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();

  const submitEvent = async (
    event: initialEventData,
    isUpdate: boolean = false
  ) => {
    try {
      if (isUpdate && !placeId && !eventId) {
        throw new Error("Place ID or event ID is required for update");
      }

      const payload = {
        ...event,
        schedule: event.schedule.map((period) => ({
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
      const response = await withLoading(() =>
        axios[method](
          `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}/events/${
            isUpdate ? eventId : ""
          }`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
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
