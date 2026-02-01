import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useEventInvitationActions = (onUpdate?: () => void) => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const updateEventInvitations = async (
    eventInvitationUpdates: Array<{
      _id: string;
      status?: "pending" | "accepted" | "refused" | "cancelled" | "completed";
      deleted?: boolean;
    }>
  ) => {
    try {
      await withLoading(() =>
        axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/event-invitations`,
          { eventInvitations: eventInvitationUpdates },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      );

      showSuccess("Invitation mise à jour");
      onUpdate?.();
    } catch (error) {
      console.error("Error updating event invitations:", error);
      showError("Erreur lors de la mise à jour de l'invitation");
    }
  };

  const acceptEventInvitation = async (eventInvitationId: string) => {
    await updateEventInvitations([
      { _id: eventInvitationId, status: "accepted" },
    ]);
  };

  const refuseEventInvitation = async (eventInvitationId: string) => {
    await updateEventInvitations([
      { _id: eventInvitationId, status: "refused" },
    ]);
  };

  return {
    isLoading,
    updateEventInvitations,
    acceptEventInvitation,
    refuseEventInvitation,
  };
};
