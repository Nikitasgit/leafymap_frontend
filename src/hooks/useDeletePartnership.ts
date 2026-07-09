import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

const useDeletePartnership = (onDelete?: () => void) => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();
  const { t } = useTranslation("account");

  const deletePartnership = async (
    partnershipId: string,
    successMessage?: string
  ) => {
    try {
      await withLoading(() =>
        apiClient.delete(
          `/api/partnerships/${partnershipId}`,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      );
      showSuccess(successMessage ?? t("useDeletePartnership.deleteSuccess"));
      onDelete?.();
      return true;
    } catch (err: unknown) {
      showError(
        getErrorMessage(
          err, t, t("useDeletePartnership.deleteCollaborationError"),
        ),
      );
      throw err;
    }
  };

  return { deletePartnership, isLoading };
};

export default useDeletePartnership;
