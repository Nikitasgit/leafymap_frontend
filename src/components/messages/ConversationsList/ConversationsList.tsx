import React from "react";
import { useConversations } from "@/hooks/useConversations";
import ConversationCard from "../ConversationCard/ConversationCard";
import EmptyState from "@/components/common/noResults/EmptyState";
import { MessageSquare } from "lucide-react";
import styles from "./ConversationsList.module.scss";


const ConversationsList: React.FC = () => {
  const {
    conversations,
    isLoading,
  } = useConversations({ autoFetch: true });

  if (isLoading) {
    return (
      <div className={styles.conversationsList}>
        <div className={styles.loading}>Chargement...</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className={styles.conversationsList}>
        <EmptyState
          title="Aucune conversation"
          description="Vous n'avez pas encore de conversations"
          icon={<MessageSquare className={styles.icon} />}
        />
      </div>
    );
  }

  return (
    <div className={styles.conversationsList}>
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation._id}
          conversation={conversation}
        />
      ))}
    </div>
  );
};

export default ConversationsList;
