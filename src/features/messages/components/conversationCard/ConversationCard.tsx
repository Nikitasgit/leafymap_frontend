"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import type { Conversation } from "../../types";
import { useAuth } from "@/features/auth";
import DisplayPublishingDate from "@/shared/ui/date/displayPublishingDate";
import Avatar from "@/shared/ui/avatar";
import { getDisplayName } from "@/shared/utils/userDisplay";
import styles from "./ConversationCard.module.scss";
import NotificationBadge from "@/shared/ui/badges/notificationBadge";
import { useRouter, useParams } from "next/navigation";

interface ConversationCardProps {
  conversation: Conversation;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
}) => {
  const { t } = useTranslation("messages");
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const otherParticipant = conversation.participants.find(
    (participant) => participant.id !== user?.id,
  );

  if (!otherParticipant) {
    return null;
  }

  const participantName = getDisplayName(otherParticipant);
  const lastMessageDate = conversation.lastMessage?.createdAt;

  return (
    <div
      className={`${styles.conversationCard} ${
        conversation.unreadCount > 0 ? styles.hasUnread : ""
      }`}
      onClick={() => {
        router.push(
          `/${locale}/inbox?conversationId=${conversation.id}&recipientId=${otherParticipant.id}`,
        );
      }}
    >
      <div className={styles.avatarContainer}>
        <Avatar user={otherParticipant} size={56} className={styles.avatar} />
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
            {conversation.lastMessage?.content ||
              t("conversationCard.noMessage")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
