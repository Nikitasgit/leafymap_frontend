import { useState, useCallback } from "react";
import axios from "axios";
import { useToast } from "./useToast";

interface SendMessageParams {
  recipientId: string;
  content: string;
}

interface SendMessageResult {
  _id: string;
  conversationId: string;
}

interface UseSendMessageReturn {
  sendMessage: (params: SendMessageParams) => Promise<SendMessageResult | void>;
  isSending: boolean;
}

export const useSendMessage = (
  onMessageSent?: (result: SendMessageResult) => void
): UseSendMessageReturn => {
  const [isSending, setIsSending] = useState(false);
  const { showError, showSuccess } = useToast();

  const sendMessage = useCallback(
    async ({
      recipientId,
      content,
    }: SendMessageParams): Promise<SendMessageResult | void> => {
      if (!content.trim() || isSending) {
        return;
      }

      setIsSending(true);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
          {
            recipientId,
            content: content.trim(),
          },
          {
            withCredentials: true,
          }
        );

        const result = response.data?.data as SendMessageResult;
        showSuccess("Message envoyé");
        onMessageSent?.(result);
        return result;
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
