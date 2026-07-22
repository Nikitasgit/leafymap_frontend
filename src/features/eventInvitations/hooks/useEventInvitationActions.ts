import { useTranslation } from "react-i18next";
import { useToast } from "@/shared/hooks/useToast";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";
import { updateEventInvitations as updateEventInvitationsRequest } from "../api/eventInvitationsApi";

export const useEventInvitationActions = (onUpdate?: () => void) => {
  const { showError, showSuccess } = useToast();
  const { t } = useTranslation("events");

  const { mutate: updateEventInvitations, isLoading } = useApiMutation(
    async (
      eventInvitationUpdates: Array<{
        id: string;
        status?: "pending" | "accepted" | "refused" | "cancelled" | "completed";
        deleted?: boolean;
      }>,
      successMessage?: string,
    ) => {
      try {
        await updateEventInvitationsRequest(eventInvitationUpdates);
        showSuccess(successMessage ?? t("eventInvitationActions.updated"));
        onUpdate?.();
      } catch (error) {
        showError(
          getErrorMessage(error, t, t("eventInvitationActions.updateError")),
        );
      }
    },
    { onError: "silent" },
  );

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
      t("eventInvitationActions.participationCancelled"),
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
