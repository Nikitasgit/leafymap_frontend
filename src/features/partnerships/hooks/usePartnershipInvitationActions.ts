import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { updatePartnerships as updatePartnershipsApi } from "../api/partnershipsApi";
import useDeletePartnership from "./useDeletePartnership";
import type { PartnershipUpdate } from "../api/partnershipsApi";

export const usePartnershipInvitationActions = (onUpdate?: () => void) => {
  const { t } = useTranslation("account");
  const { deletePartnership } = useDeletePartnership(onUpdate);

  const { mutate: updatePartnerships, isLoading } = useApiMutation(
    async (partnershipUpdates: PartnershipUpdate[]) => {
      await updatePartnershipsApi(partnershipUpdates);
      onUpdate?.();
    },
    { successMessage: t("usePartnershipInvitationActions.updateSuccess") },
  );

  const acceptPartnershipInvitation = async (partnershipId: string) => {
    await updatePartnerships([{ id: partnershipId, status: "accepted" }]);
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
