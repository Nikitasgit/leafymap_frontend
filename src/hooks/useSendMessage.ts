import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";

interface SendMessageParams {
  recipientId: string;
  content: string;
}

interface SendMessageResult {
  id: string;
  conversationId: string;
}

interface UseSendMessageReturn {
  sendMessage: (params: SendMessageParams) => Promise<SendMessageResult | void>;
  isSending: boolean;
}

export const useSendMessage = (
  onMessageSent?: (result: SendMessageResult) => void
): UseSendMessageReturn => {
  const { t } = useTranslation("messages");
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
        const response = await apiClient.post(
          `/api/messages`,
          {
            recipientId,
            content: content.trim(),
          },
          {
          }
        );

        const result = response.data?.data as SendMessageResult;
        showSuccess(t("useSendMessage.success"));
        onMessageSent?.(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : t("useSendMessage.error");
        showError(errorMessage);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [isSending, onMessageSent, showError, showSuccess, t]
  );

  return { sendMessage, isSending };
};
