import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useEventInvitationActions = (onUpdate?: () => void) => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();
  const { t } = useTranslation("events");

  const updateEventInvitations = async (
    eventInvitationUpdates: Array<{
      id: string;
      status?: "pending" | "accepted" | "refused" | "cancelled" | "completed";
      deleted?: boolean;
    }>,
    successMessage?: string
  ) => {
    try {
      await withLoading(() =>
        apiClient.put(
          `/api/event-invitations`,
          { eventInvitations: eventInvitationUpdates },
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      );

      showSuccess(successMessage ?? t("eventInvitationActions.updated"));
      onUpdate?.();
    } catch (error) {
      console.error("Error updating event invitations:", error);
      showError(
        getErrorMessage(error, t, t("eventInvitationActions.updateError"))
      );
    }
  };

  const acceptEventInvitation = async (eventInvitationId: string) => {
    await updateEventInvitations([
      { id: eventInvitationId, status: "accepted" },
    ]);
  };

  const refuseEventInvitation = async (eventInvitationId: string) => {
    await updateEventInvitations([
      { id: eventInvitationId, status: "refused" },
    ]);
  };

  const cancelEventInvitation = async (eventInvitationId: string) => {
    await updateEventInvitations(
      [{ id: eventInvitationId, status: "cancelled" }],
      t("eventInvitationActions.participationCancelled")
    );
  };

  return {
    isLoading,
    updateEventInvitations,
    acceptEventInvitation,
    refuseEventInvitation,
    cancelEventInvitation,
  };
};
