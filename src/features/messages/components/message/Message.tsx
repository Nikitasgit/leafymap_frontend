"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import DisplayPublishingDate from "@/shared/ui/date/displayPublishingDate";
import PartnershipMessage from "../partnershipMessage";
import { Avatar } from "@/shared/ui/avatar";
import { getDisplayName } from "@/shared/utils/userDisplay";
import type { Message } from "../../types";
import styles from "./Message.module.scss";

interface MessageProps {
  message: Message;
  currentUserId?: string;
}

const MessageComponent: React.FC<MessageProps> = ({
  message,
  currentUserId,
}) => {
  const { t } = useTranslation("messages");
  const isOwnMessage = currentUserId === message.sender.id;
  const isPartnershipMessage = !!message.partnership;

  const senderName = getDisplayName(message.sender);

  return (
    <div
      className={`${styles.messageContainer} ${
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      } ${isPartnershipMessage ? styles.partnershipMessage : ""}`}
    >
      {!isOwnMessage && (
        <div className={styles.avatarContainer}>
          <Avatar user={message.sender} size={32} />
        </div>
      )}
      <div className={styles.messageBubble}>
        {isPartnershipMessage &&
        message.partnership &&
        typeof message.partnership === "object" ? (
          <>
            <PartnershipMessage
              partnership={message.partnership}
              sender={message.sender}
            />
            <div className={styles.messageFooter}>
              <DisplayPublishingDate
                date={message.createdAt}
                className={styles.timestamp}
              />
            </div>
          </>
        ) : (
          <>
            {!isOwnMessage && (
              <span className={styles.senderName}>{senderName}</span>
            )}
            <p className={styles.messageContent}>
              {message.content || t("message.emptyContent")}
            </p>
            <div className={styles.messageFooter}>
              <DisplayPublishingDate
                date={message.createdAt}
                className={styles.timestamp}
              />
            </div>
          </>
        )}
      </div>
      {isOwnMessage && (
        <div className={styles.avatarContainer}>
          <Avatar user={message.sender} size={32} />
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
