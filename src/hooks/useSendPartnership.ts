import { useCallback } from "react";
import axios from "axios";
import { useToast } from "./useToast";

export const useSendPartnership = (onSuccess?: () => void) => {
  const { showSuccess, showError, showInfo } = useToast();

  const sendPartnership = useCallback(
    async (collaboratorId: string) => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/partnerships`,
          {
            partnership: {
              collaborator: { _id: collaboratorId },
            },
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        showSuccess("Invitation envoyée");
        onSuccess?.();
      } catch (err) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : err instanceof Error
            ? err.message
            : "Erreur lors de l'envoi de l'invitation";
        const isAlreadySent =
          axios.isAxiosError(err) && err.response?.status === 409;
        if (isAlreadySent) {
          showInfo(message);
        } else {
          showError(message);
        }
      }
    },
    [showSuccess, showError, showInfo, onSuccess]
  );

  return { sendPartnership };
};
