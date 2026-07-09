"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Message, { Message as MessageType } from "../Message";
import EmptyState from "@/components/common/noResults/EmptyState";
import { MessageSquare } from "lucide-react";
import styles from "./MessagesList.module.scss";

interface MessagesListProps {
  messages: MessageType[];
}

const MessagesList: React.FC<MessagesListProps> = ({ messages }) => {
  const { t } = useTranslation("messages");
  const { user } = useAuth();
  const currentUserId = user?._id;
  const messagesListRef = useRef<HTMLDivElement>(null);
  const previousMessagesLengthRef = useRef<number>(0);
  const hasScrolledToBottomRef = useRef<boolean>(false);

  const scrollToBottom = (smooth: boolean = false) => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTo({
        top: messagesListRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  useLayoutEffect(() => {
    if (messages.length === 0) return;

    const previousLength = previousMessagesLengthRef.current;
    const currentLength = messages.length;

    if (previousLength === 0 && currentLength > 0) {
      scrollToBottom(false);
      hasScrolledToBottomRef.current = true;
      previousMessagesLengthRef.current = currentLength;
      return;
    }

    if (currentLength > previousLength) {
      const isNearBottom =
        messagesListRef.current &&
        messagesListRef.current.scrollHeight -
          messagesListRef.current.scrollTop -
          messagesListRef.current.clientHeight <
          200;

      const lastMessage = messages[messages.length - 1];
      const isOwnMessage = lastMessage?.sender?._id === currentUserId;

      if (isNearBottom || isOwnMessage) {
        scrollToBottom(true);
      }
    }

    previousMessagesLengthRef.current = currentLength;
  }, [messages, currentUserId]);

  useEffect(() => {
    if (messages.length > 0 && !hasScrolledToBottomRef.current) {
      scrollToBottom(false);
      hasScrolledToBottomRef.current = true;
    }
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className={styles.messagesList} ref={messagesListRef}>
        <EmptyState
          title={t("messagesList.emptyTitle")}
          description={t("messagesList.emptyDescription")}
          icon={<MessageSquare className={styles.icon} />}
        />
      </div>
    );
  }

  return (
    <div className={styles.messagesList} ref={messagesListRef}>
      {messages.map((message) => (
        <Message
          key={message._id}
          message={message}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default MessagesList;
