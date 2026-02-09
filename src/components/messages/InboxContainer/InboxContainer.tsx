"use client";

import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useConversations } from "@/hooks/useConversations";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import ConversationsList from "@/components/messages/ConversationsList";
import ConversationContainer from "@/components/messages/ConversationContainer";
import styles from "./InboxContainer.module.scss";

export default function InboxContainer() {
  const searchParams = useSearchParams();
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const conversationId = searchParams.get("conversationId");
  const recipientId = searchParams.get("recipientId");

  const {
    conversations,
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = useConversations({ autoFetch: true });

  const hasConversation = !!(conversationId && recipientId);

  if (isLoadingUser || !user) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.inbox} ${
          hasConversation ? styles.hasConversationOpen : ""
        }`}
      >
        <div
          className={`${styles.conversationsColumn} ${
            hasConversation ? styles.hasConversation : ""
          }`}
        >
          <div className={styles.conversationsListColumn}>
            <h2 className={styles.sectionTitle}>Conversations</h2>
            <div className={styles.conversationsListWrapper}>
              <ConversationsList
                conversations={conversations}
                isLoading={isLoadingConversations}
              />
            </div>
          </div>
          {hasConversation && (
            <div className={styles.conversationViewColumn}>
              <ConversationContainer
                conversationId={conversationId!}
                recipientId={recipientId!}
                onConversationCreated={refetchConversations}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
