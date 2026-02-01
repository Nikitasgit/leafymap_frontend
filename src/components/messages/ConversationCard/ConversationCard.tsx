import React from "react";
import Image from "next/image";
import { Handshake } from "lucide-react";
import { Conversation } from "@/hooks/useConversations";
import { useAuth } from "@/hooks/useAuth";
import DisplayPublishingDate from "@/components/common/date/DisplayPublishingDate/DisplayPublishingDate";
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

  const getMessageContent = (): { text: string; isPartnership: boolean } => {
    const lastMessage = conversation.lastMessage;
    if (!lastMessage) return { text: "Aucun message", isPartnership: false };

    if (lastMessage.partnership) {
      const partnership =
        typeof lastMessage.partnership === "object"
          ? lastMessage.partnership
          : null;

      if (partnership?.type === "place") {
        return { text: "Proposition de collaboration", isPartnership: true };
      }
    }

    return {
      text: lastMessage.content || "Aucun message",
      isPartnership: false,
    };
  };

  const messageContent = getMessageContent();

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
          {messageContent.isPartnership && (
            <Handshake size={16} className={styles.partnershipIcon} />
          )}
          <span
            className={`${styles.messageText} ${
              conversation.unreadCount > 0 ? styles.unread : ""
            }`}
          >
            {messageContent.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
