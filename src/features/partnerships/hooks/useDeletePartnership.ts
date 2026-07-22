import { useTranslation } from "react-i18next";
import { useToast } from "@/shared/hooks/useToast";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { deletePartnership as deletePartnershipApi } from "../api/partnershipsApi";

const useDeletePartnership = (onDelete?: () => void) => {
  const { t } = useTranslation("account");
  const { showSuccess } = useToast();

  const { mutate, isLoading } = useApiMutation(
    async (partnershipId: string, successMessage?: string) => {
      await deletePartnershipApi(partnershipId);
      showSuccess(successMessage ?? t("useDeletePartnership.deleteSuccess"));
      onDelete?.();
      return true as const;
    },
    { rethrow: true },
  );

  return { deletePartnership: mutate, isLoading };
};

export default useDeletePartnership;
