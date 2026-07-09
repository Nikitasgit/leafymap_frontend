import { useCallback } from "react";
import { apiClient, isAxiosError } from "@/lib/api/client";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useSendPartnership = (onSuccess?: () => void) => {
  const { showSuccess, showError, showInfo } = useToast();
  const { t } = useTranslation("account");

  const sendPartnership = useCallback(
    async (collaboratorId: string) => {
      try {
        await apiClient.post(
          `/api/partnerships`,
          {
            partnership: {
              collaborator: { _id: collaboratorId },
            },
          },
          {
            headers: { "Content-Type": "application/json" }
          }
        );
        showSuccess(t("useSendPartnership.sendSuccess"));
        onSuccess?.();
      } catch (err) {
        const message = getErrorMessage(
          err, t, t("useSendPartnership.sendError"),
        );
        const isAlreadySent =
          isAxiosError(err) && err.response?.status === 409;
        if (isAlreadySent) {
          showInfo(message);
        } else {
          showError(message);
        }
      }
    },
    [showSuccess, showError, showInfo, onSuccess, t]
  );

  return { sendPartnership };
};
