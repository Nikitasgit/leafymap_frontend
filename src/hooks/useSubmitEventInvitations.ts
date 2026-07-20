import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import { Partnership } from "@/types/partnerships";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useSubmitEventInvitations = (onUpdate?: () => void) => {
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();
  const { t } = useTranslation("events");

  const submitEventInvitations = async (
    eventInvitations: Partnership[],
    isUpdate: boolean = false,
    eventId: string
  ) => {
    try {
      const filteredEventInvitations = eventInvitations.map((invitation) => {
        if (isUpdate) {
          return {
            id: invitation.id,
            deleted: invitation.deleted,
            status: invitation.status,
          };
        } else {
          return {
            collaborator: invitation.collaborator,
          };
        }
      });
      const method = isUpdate ? "put" : "post";
      await withLoading(() =>
        isUpdate
          ? apiClient[method](
              `/api/event-invitations`,
              { eventInvitations: filteredEventInvitations },
              {
                headers: {
                  "Content-Type": "application/json",
                }
              }
            )
          : apiClient[method](
              `/api/event-invitations/event/${eventId}`,
              { eventInvitations: filteredEventInvitations },
              {
                headers: {
                  "Content-Type": "application/json",
                }
              }
            )
      );
      onUpdate?.();
    } catch (err) {
      showError(
        getErrorMessage(err, t, t("submitEventInvitations.updateError"))
      );
    }
  };

  return {
    isLoading,
    submitEventInvitations,
  };
};
