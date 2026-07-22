import { useTranslation } from "react-i18next";
import { isAxiosError } from "@/shared/api/client";
import { useToast } from "@/shared/hooks/useToast";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";
import { createPartnership } from "../api/partnershipsApi";

export const useSendPartnership = (onSuccess?: () => void) => {
  const { showSuccess, showError, showInfo } = useToast();
  const { t } = useTranslation("account");

  const { mutate } = useApiMutation(
    async (collaboratorId: string) => {
      try {
        await createPartnership(collaboratorId);
        showSuccess(t("useSendPartnership.sendSuccess"));
        onSuccess?.();
      } catch (err) {
        const message = getErrorMessage(
          err,
          t,
          t("useSendPartnership.sendError"),
        );
        const isAlreadySent = isAxiosError(err) && err.response?.status === 409;
        if (isAlreadySent) {
          showInfo(message);
        } else {
          showError(message);
        }
      }
    },
    { onError: "silent" },
  );

  return { sendPartnership: mutate };
};
