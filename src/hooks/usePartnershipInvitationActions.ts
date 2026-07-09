import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import useDeletePartnership from "./useDeletePartnership";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const usePartnershipInvitationActions = (onUpdate?: () => void) => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();
  const { deletePartnership } = useDeletePartnership(onUpdate);
  const { t } = useTranslation("account");

  const updatePartnerships = async (
    partnershipUpdates: Array<{
      _id: string;
      status?: "pending" | "accepted";
      deleted?: boolean;
    }>
  ) => {
    try {
      await withLoading(() =>
        apiClient.put(
          `/api/partnerships/update`,
          { partnerships: partnershipUpdates },
          {
            headers: { "Content-Type": "application/json" }
          }
        )
      );

      showSuccess(t("usePartnershipInvitationActions.updateSuccess"));
      onUpdate?.();
    } catch (error) {
      console.error("Error updating partnership:", error);
      showError(
        getErrorMessage(
          error, t, t("usePartnershipInvitationActions.updateError"),
        ),
      );
    }
  };

  const acceptPartnershipInvitation = async (partnershipId: string) => {
    await updatePartnerships([{ _id: partnershipId, status: "accepted" }]);
  };

  const refusePartnershipInvitation = async (partnershipId: string) => {
    await deletePartnership(
      partnershipId,
      t("usePartnershipInvitationActions.refuseSuccess"),
    );
  };

  const cancelPartnershipInvitation = async (partnershipId: string) => {
    await deletePartnership(
      partnershipId,
      t("usePartnershipInvitationActions.cancelSuccess"),
    );
  };

  return {
    isLoading,
    updatePartnerships,
    acceptPartnershipInvitation,
    refusePartnershipInvitation,
    cancelPartnershipInvitation,
  };
};
