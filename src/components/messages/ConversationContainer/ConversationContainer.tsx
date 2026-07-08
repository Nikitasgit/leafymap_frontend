"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useConversationMessages } from "@/hooks/useConversationMessages";
import { useUser } from "@/hooks/useUser";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import MessagesList from "../MessagesList";
import MessageInput from "../MessageInput";
import { CreatorCard } from "@/components/userProfile/PlacesSection/CreatorCard";
import { UserCard } from "@/components/userProfile/PlacesSection/UserCard";
import { ConversationViewSkeleton } from "../skeletons";
import { PlacePopulated } from "@/types/place";
import BackButton from "@/components/common/buttons/BackButton";
import styles from "./ConversationContainer.module.scss";

interface ConversationContainerProps {
  conversationId: string;
  recipientId: string;
  onConversationCreated?: () => void;
  children?: React.ReactNode;
}

const ConversationContainer: React.FC<ConversationContainerProps> = ({
  conversationId,
  recipientId,
  onConversationCreated,
  children,
}) => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { user: currentUser } = useAuth();

  const isNewConversation = conversationId === "new";

  const { messages: conversationMessages, isLoading: isLoadingConversation } =
    useConversationMessages(isNewConversation ? null : conversationId, {
      autoFetch: !isNewConversation,
    });

  const { user: otherParticipant, isLoading: isLoadingRecipient } =
    useUser(recipientId);
  const { markConversationAsRead } = useUserNotifications({
    autoFetch: !!currentUser,
  });
  const hasMarkedAsReadRef = useRef(false);

  const handleMessageSent = useCallback(
    (result?: { conversationId?: string }) => {
      if (!isNewConversation || !result?.conversationId) return;
      onConversationCreated?.();
      router.replace(
        `/${locale}/inbox?conversationId=${result.conversationId}&recipientId=${recipientId}`
      );
    },
    [isNewConversation, onConversationCreated, router, locale, recipientId]
  );

  useEffect(() => {
    if (
      !isNewConversation &&
      !isLoadingConversation &&
      conversationId &&
      currentUser &&
      !hasMarkedAsReadRef.current
    ) {
      hasMarkedAsReadRef.current = true;
      markConversationAsRead(conversationId);
    }
  }, [
    isNewConversation,
    isLoadingConversation,
    conversationId,
    currentUser,
    markConversationAsRead,
  ]);

  useEffect(() => {
    hasMarkedAsReadRef.current = false;
  }, [conversationId]);

  const messages = isNewConversation ? [] : conversationMessages;
  const isLoading = isNewConversation
    ? isLoadingRecipient
    : isLoadingConversation || isLoadingRecipient;

  if (isLoading) {
    return <ConversationViewSkeleton />;
  }

  return (
    <div className={styles.pageContainer}>
      <section className={styles.container}>
        <div className={styles.backButtonWrapper}>
          <BackButton />
        </div>
        {otherParticipant && (
          <div className={styles.userCardContainer}>
            {otherParticipant.userType === "creator" ? (
              <CreatorCard
                user={otherParticipant}
                place={otherParticipant.place as PlacePopulated}
              />
            ) : (
              <UserCard user={otherParticipant} />
            )}
          </div>
        )}
        <MessagesList messages={messages} />
        {otherParticipant && (
          <MessageInput
            recipientId={otherParticipant._id.toString()}
            onMessageSent={isNewConversation ? handleMessageSent : undefined}
          />
        )}
        {children}
      </section>
    </div>
  );
};

export default ConversationContainer;
