import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { confirmTwice } from "@/shared/utils/confirmTwice";
import { deleteEvent as deleteEventRequest } from "../api/eventsApi";

const useDeleteEvent = () => {
  const { t } = useTranslation("events");

  const { mutate: deleteEvent, isLoading } = useApiMutation(
    async (eventId: string) => {
      await deleteEventRequest(eventId);
      return true as const;
    },
    { successMessage: t("deleteEvent.success") },
  );

  const deleteEventWithConfirmation = async (eventId: string) => {
    if (
      !confirmTwice({
        first: t("deleteEvent.confirmMessage"),
        second: t("deleteEvent.doubleConfirmMessage"),
      })
    ) {
      return;
    }
    return deleteEvent(eventId);
  };

  return { deleteEvent: deleteEventWithConfirmation, isLoading };
};

export default useDeleteEvent;
