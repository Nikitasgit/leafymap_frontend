import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";
import { useTranslation } from "react-i18next";

const useDeleteEvent = () => {
  const { isLoading, withLoading } = useLoading();
  const { showSuccess } = useToast();
  const { handleApiError } = useHandleApiErrors();
  const { t } = useTranslation("events");

  const deleteEvent = async (eventId: string) => {
    try {
      await withLoading(() =>
        apiClient.delete(
          `/api/events/${eventId}`,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      );

      showSuccess(t("deleteEvent.success"));
      window.location.reload();
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  const deleteEventWithConfirmation = async (eventId: string) => {
    const confirmed = window.confirm(t("deleteEvent.confirmMessage"));

    if (confirmed) {
      const doubleConfirmed = window.confirm(
        t("deleteEvent.doubleConfirmMessage")
      );

      if (doubleConfirmed) {
        await withLoading(() => deleteEvent(eventId));
      }
    }
  };

  return { deleteEvent: deleteEventWithConfirmation, isLoading };
};

export default useDeleteEvent;
