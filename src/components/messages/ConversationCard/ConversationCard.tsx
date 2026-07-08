import React from "react";
import Image from "next/image";
import { Conversation } from "@/hooks/useConversations";
import { useAuth } from "@/hooks/useAuth";
import DisplayPublishingDate from "@/components/common/date/DisplayPublishingDate";
import { getDisplayName, getAvatarLetter } from "@/utils/userDisplay";
import styles from "./ConversationCard.module.scss";
import NotificationBadge from "@/components/common/badges/NotificationBadge";
import { useRouter, useParams } from "next/navigation";

interface ConversationCardProps {
  conversation: Conversation;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const otherParticipant = conversation.participants.find(
    (participant) => participant._id !== user?._id
  );

  if (!otherParticipant) {
    return null;
  }

  const participantImage = otherParticipant.image?.urls?.thumbnail;
  const participantName = getDisplayName(otherParticipant);
  const avatarLetter = getAvatarLetter(otherParticipant);
  const lastMessageDate = conversation.lastMessage?.createdAt;

  return (
    <div
      className={`${styles.conversationCard} ${
        conversation.unreadCount > 0 ? styles.hasUnread : ""
      }`}
      onClick={() => {
        router.push(
          `/${locale}/inbox?conversationId=${conversation._id}&recipientId=${otherParticipant._id}`
        );
      }}
    >
      <div className={styles.avatarContainer}>
        {participantImage ? (
          <Image
            src={participantImage}
            alt={participantName}
            width={56}
            height={56}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>{avatarLetter}</div>
        )}
        <NotificationBadge count={conversation.unreadCount} absolutePosition />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.username}>{participantName}</span>
          {lastMessageDate && (
            <DisplayPublishingDate
              date={lastMessageDate}
              className={styles.date}
            />
          )}
        </div>
        <div className={styles.messagePreview}>
          <span
            className={`${styles.messageText} ${
              conversation.unreadCount > 0 ? styles.unread : ""
            }`}
          >
            {conversation.lastMessage?.content || "Aucun message"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
