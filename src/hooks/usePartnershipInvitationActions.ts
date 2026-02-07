import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import useDeletePartnership from "./useDeletePartnership";

export const usePartnershipInvitationActions = (onUpdate?: () => void) => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();
  const { deletePartnership } = useDeletePartnership(onUpdate);

  const updatePartnerships = async (
    partnershipUpdates: Array<{
      _id: string;
      status?: "pending" | "accepted";
      deleted?: boolean;
    }>
  ) => {
    try {
      await withLoading(() =>
        axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/partnerships/update`,
          { partnerships: partnershipUpdates },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
      );

      showSuccess("Invitation mise à jour");
      onUpdate?.();
    } catch (error) {
      console.error("Error updating partnership:", error);
      showError("Erreur lors de la mise à jour de l'invitation");
    }
  };

  const acceptPartnershipInvitation = async (partnershipId: string) => {
    await updatePartnerships([{ _id: partnershipId, status: "accepted" }]);
  };

  const refusePartnershipInvitation = async (partnershipId: string) => {
    await deletePartnership(partnershipId, "Invitation refusée");
  };

  const cancelPartnershipInvitation = async (partnershipId: string) => {
    await deletePartnership(partnershipId, "Invitation annulée");
  };

  return {
    isLoading,
    updatePartnerships,
    acceptPartnershipInvitation,
    refusePartnershipInvitation,
    cancelPartnershipInvitation,
  };
};
