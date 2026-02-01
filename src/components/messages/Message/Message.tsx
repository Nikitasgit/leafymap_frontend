import React from "react";
import DisplayPublishingDate from "@/components/common/date/DisplayPublishingDate/DisplayPublishingDate";
import PartnershipMessage from "@/components/messages/PartnershipMessage";
import type { MessagePartnership } from "@/components/messages/PartnershipMessage";
import { Avatar } from "@/components/common/Avatar";
import { getDisplayName } from "@/utils/userDisplay";
import styles from "./Message.module.scss";

export interface Message {
  _id: string;
  sender: {
    _id: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    image?: {
      urls: {
        thumbnail: string;
        medium: string;
      };
    };
  };
  content?: string;
  createdAt: Date | string;
  readBy: string[];
  partnership?: MessagePartnership | string;
}

interface MessageProps {
  message: Message;
  currentUserId?: string;
}

const MessageComponent: React.FC<MessageProps> = ({
  message,
  currentUserId,
}) => {
  const isOwnMessage = currentUserId === message.sender._id;
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
              {message.content || "Message vide"}
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
