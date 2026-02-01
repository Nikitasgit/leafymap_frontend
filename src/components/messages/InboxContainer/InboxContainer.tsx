"use client";

import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useConversations } from "@/hooks/useConversations";
import { useUserEventsPartnershipsByUserId } from "@/hooks/useUserEventsPartnershipsByUserId";
import { useUserPlacesPartnershipsByUserId } from "@/hooks/useUserPlacesPartnershipsByUserId";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import ConversationsList from "@/components/messages/ConversationsList";
import ConversationContainer from "@/components/messages/ConversationContainer";
import EventInvitationsSection from "./EventInvitationsSection";
import PartnershipInvitationsSection from "./PartnershipInvitationsSection";
import styles from "./InboxContainer.module.scss";

export default function InboxContainer() {
  const searchParams = useSearchParams();
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const conversationId = searchParams.get("conversationId");
  const recipientId = searchParams.get("recipientId");

  const { partnerships: eventPartnerships, isLoading: isLoadingEvents } =
    useUserEventsPartnershipsByUserId(user?._id, {
      asCollaborator: "true",
      includeCancelledEvents: "false",
      includePastEvents: "false",
      onlyAccepted: "false",
      onlyPending: "true",
    });
  const { partnerships: placePartnerships, isLoading: isLoadingPlaces } =
    useUserPlacesPartnershipsByUserId(user?._id, {
      asCollaborator: "true",
      onlyAccepted: "false",
      onlyPending: "true",
    });

  const {
    conversations,
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = useConversations({ autoFetch: true });

  const isCreator = user?.userType === "creator";
  const hasConversation = !!(conversationId && recipientId);

  const pendingEventCount = eventPartnerships.length;
  const pendingPlaceCount = placePartnerships.length;
  const invitationsLoaded = !isLoadingEvents && !isLoadingPlaces;
  const hasAnyInvitations =
    isCreator &&
    invitationsLoaded &&
    (pendingEventCount > 0 || pendingPlaceCount > 0);

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
        {hasAnyInvitations && (
          <aside className={styles.invitationsColumn}>
            <div className={styles.invitationsWrapper}>
              <EventInvitationsSection />
              <PartnershipInvitationsSection />
            </div>
          </aside>
        )}
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
