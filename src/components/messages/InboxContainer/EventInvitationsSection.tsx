"use client";

import React from "react";
import EventCard from "@/components/common/events/EventCard/EventCard";
import Button from "@/components/common/buttons/Button/Button";
import { EventInvitationPopulated } from "@/types/eventInvitation";
import { UserPopulated } from "@/types/user";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEventInvitationActions } from "@/hooks/useEventInvitationActions";
import styles from "./InboxContainer.module.scss";
import { EventPopulated } from "@/types/place/event";

export interface EventInvitationsSectionProps {
  eventInvitations: EventInvitationPopulated[];
  isLoading: boolean;
  refetch: () => void;
}

export default function EventInvitationsSection({
  eventInvitations,
  isLoading,
  refetch,
}: EventInvitationsSectionProps) {
  const { user } = useCurrentUser();
  const {
    acceptEventInvitation,
    refuseEventInvitation,
    isLoading: isUpdating,
  } = useEventInvitationActions(refetch);

  if (!user) return null;

  if (isLoading) return null;
  if (eventInvitations.length === 0) return null;

  return (
    <section className={styles.invitationSection}>
      <h2 className={styles.sectionTitle}>Invitations évènements</h2>
      <div className={styles.partnershipsList}>
        {eventInvitations.map((invitation) => {
          if (!invitation.event || !invitation.event._id) return null;
          const event = invitation.event as EventPopulated;
          const initiator = invitation.initiator;
          return (
            <div key={invitation._id} className={styles.invitationCardWrapper}>
              <EventCard
                event={event}
                place={undefined}
                user={initiator as UserPopulated | undefined}
                clickable={!!event._id}
              />
              <div className={styles.invitationCardActions}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => acceptEventInvitation(invitation._id)}
                  disabled={isUpdating}
                  fullWidth
                  ariaLabel="Accepter l'invitation"
                >
                  Accepter
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  size="small"
                  onClick={() => refuseEventInvitation(invitation._id)}
                  disabled={isUpdating}
                  ariaLabel="Refuser l'invitation"
                >
                  Refuser
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
