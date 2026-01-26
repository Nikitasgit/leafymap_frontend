import { useState, useCallback } from "react";
import axios from "axios";
import { useToast } from "./useToast";

interface SendMessageParams {
  recipientId: string;
  content: string;
}

interface UseSendMessageReturn {
  sendMessage: (params: SendMessageParams) => Promise<void>;
  isSending: boolean;
}

export const useSendMessage = (
  onMessageSent?: () => void
): UseSendMessageReturn => {
  const [isSending, setIsSending] = useState(false);
  const { showError, showSuccess } = useToast();

  const sendMessage = useCallback(
    async ({ recipientId, content }: SendMessageParams) => {
      if (!content.trim() || isSending) {
        return;
      }

      setIsSending(true);

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
          {
            recipientId,
            content: content.trim(),
          },
          {
            withCredentials: true,
          }
        );

        showSuccess("Message envoyé");
        onMessageSent?.();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de l'envoi du message";
        showError(errorMessage);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [isSending, onMessageSent, showError, showSuccess]
  );

  return { sendMessage, isSending };
};
