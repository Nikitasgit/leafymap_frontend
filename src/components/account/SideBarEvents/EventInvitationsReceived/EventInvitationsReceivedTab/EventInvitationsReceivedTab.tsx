"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEventInvitationsByUserId } from "@/hooks/useEventInvitationsByUserId";
import { useEventInvitationActions } from "@/hooks/useEventInvitationActions";
import EventInvitationsReceivedList from "../EventInvitationsReceivedList";
import EmptyState from "@/components/common/noResults/EmptyState";
import LoadingBar from "@/components/common/loading/LoadingBar";
import styles from "./EventInvitationsReceivedTab.module.scss";

export default function EventInvitationsReceivedTab() {
  const { user } = useAuth();
  const {
    eventInvitations,
    isLoading,
    refetch,
  } = useEventInvitationsByUserId(user?._id, {
    asCollaborator: "true",
    includeCancelledEvents: "false",
    includePastEvents: "false",
    onlyPending: "true",
  });
  const {
    acceptEventInvitation,
    refuseEventInvitation,
    isLoading: isUpdating,
  } = useEventInvitationActions(refetch);

  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.invitationsReceivedContent}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <p className={styles.label}>
            <Inbox size={20} className={styles.icon} />
            Invitations reçues
          </p>
          <p className={styles.info}>
            Acceptez ou refusez les invitations à des évènements qui vous sont
            envoyées.
          </p>
        </div>
      </div>
      {eventInvitations.length === 0 ? (
        <EmptyState
          title="Aucune invitation reçue"
          description="Les invitations à des évènements en attente apparaîtront ici."
          icon={<Inbox className={styles.emptyIcon} />}
        />
      ) : (
        <EventInvitationsReceivedList
          eventInvitations={eventInvitations}
          isLoading={false}
          isUpdating={isUpdating}
          onAccept={acceptEventInvitation}
          onRefuse={refuseEventInvitation}
        />
      )}
    </div>
  );
}
