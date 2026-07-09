"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Conversation } from "@/hooks/useConversations";
import ConversationCard from "../ConversationCard";
import { ConversationCardSkeleton } from "../skeletons";
import EmptyState from "@/components/common/noResults/EmptyState";
import { MessageSquare } from "lucide-react";
import styles from "./ConversationsList.module.scss";

const SKELETON_COUNT = 5;

interface ConversationsListProps {
  conversations: Conversation[];
  isLoading: boolean;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  isLoading,
}) => {
  const { t } = useTranslation("messages");
  if (isLoading) {
    return (
      <div className={styles.conversationsList}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ConversationCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className={styles.conversationsList}>
        <EmptyState
          title={t("conversationsList.emptyTitle")}
          description={t("conversationsList.emptyDescription")}
          icon={<MessageSquare className={styles.icon} />}
        />
      </div>
    );
  }

  return (
    <div className={styles.conversationsList}>
      {conversations.map((conversation) => (
        <ConversationCard key={conversation._id} conversation={conversation} />
      ))}
    </div>
  );
};

export default ConversationsList;
