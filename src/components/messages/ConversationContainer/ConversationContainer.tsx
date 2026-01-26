"use client";

import React, { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useConversationMessages } from "@/hooks/useConversationMessages";
import MessagesList from "../MessagesList/MessagesList";
import MessageInput from "../MessageInput/MessageInput";
import PlaceCard from "@/components/userProfile/PlacesSection/PlaceCard/PlaceCard";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import styles from "./ConversationContainer.module.scss";
import BackButton from "@/components/common/buttons/BackButton";

interface ConversationContainerProps {
  conversationId: string;
  children?: React.ReactNode;
}

const ConversationContainer: React.FC<ConversationContainerProps> = ({
  conversationId,
  children,
}) => {
  const { user: currentUser } = useAuth();
  const { participants, messages, isLoading } = useConversationMessages(
    conversationId,
    {
      autoFetch: true,
    }
  );

  const otherParticipant = useMemo(() => {
    if (!currentUser?._id || !participants || participants.length === 0) {
      return null;
    }
    const participant = participants.find(
      (p) => p._id.toString() !== currentUser._id
    );
    if (!participant) {
      return null;
    }
    return participant;
  }, [currentUser?._id, participants]);

  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.pageContainer}>
      <section className={styles.container}>
        <div className={styles.backButtonWrapper}>
          <BackButton />
        </div>
        {otherParticipant && (
          <div className={styles.placeCardContainer}>
            <PlaceCard
              place={otherParticipant.place as PlacePopulated}
              user={otherParticipant as UserPopulated}
            />
          </div>
        )}
        <MessagesList messages={messages} />
        {otherParticipant && (
          <MessageInput recipientId={otherParticipant._id.toString()} />
        )}
        {children}
      </section>
    </div>
  );
};

export default ConversationContainer;
