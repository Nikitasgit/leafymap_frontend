import React from "react";
import Image from "next/image";
import { UserPlus } from "lucide-react";
import DisplayPublishingDate from "@/components/common/date/DisplayPublishingDate/DisplayPublishingDate";
import styles from "./Message.module.scss";

export interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
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
  partnership?: string;
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

  const senderImage = message.sender.image?.urls?.thumbnail;
  const senderName = message.sender.username || "Utilisateur";

  return (
    <div
      className={`${styles.messageContainer} ${
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      } ${isPartnershipMessage ? styles.partnershipMessage : ""}`}
    >
      {!isOwnMessage && (
        <div className={styles.avatarContainer}>
          {senderImage ? (
            <Image
              src={senderImage}
              alt={senderName}
              width={32}
              height={32}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {senderName[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
      )}
      <div className={styles.messageBubble}>
        {isPartnershipMessage && (
          <div className={styles.partnershipBadge}>
            <UserPlus size={14} />
            <span>Invitation</span>
          </div>
        )}
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
      </div>
      {isOwnMessage && (
        <div className={styles.avatarContainer}>
          {senderImage ? (
            <Image
              src={senderImage}
              alt={senderName}
              width={32}
              height={32}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {senderName[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
