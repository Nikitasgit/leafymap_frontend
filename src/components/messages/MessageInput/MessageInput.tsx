"use client";

import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import TextField from "@/components/common/inputs/TextField";
import { Send } from "lucide-react";
import { useSendMessage } from "@/hooks/useSendMessage";
import styles from "./MessageInput.module.scss";

interface MessageInputProps {
  recipientId: string;
  onMessageSent?: (result?: { id: string; conversationId: string }) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  recipientId,
  onMessageSent,
}) => {
  const { t } = useTranslation("messages");
  const [message, setMessage] = useState("");
  const { sendMessage, isSending } = useSendMessage(onMessageSent);

  const handleSend = useCallback(async () => {
    const currentMessage = message.trim();
    if (!currentMessage || isSending) {
      return;
    }

    const messageToSend = currentMessage;
    setMessage("");

    try {
      await sendMessage({
        recipientId,
        content: messageToSend,
      });
    } catch {
      setMessage(messageToSend);
    }
  }, [message, isSending, recipientId, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className={styles.messageInputContainer}>
      <div className={styles.inputWrapper}>
        <TextField
          name="message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("messageInput.placeholder")}
          multiline
          rows={3}
          maxLength={1000}
          disabled={isSending}
          className={styles.textField}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className={styles.sendButton}
          aria-label={t("common:actions.send")}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
