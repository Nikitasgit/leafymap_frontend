"use client";

import React from "react";
import EventCard from "@/components/common/events/EventCard";
import Button from "@/components/common/buttons/Button";
import { EventInvitationPopulated } from "@/types/eventInvitation";
import { EventPopulated } from "@/types/place/event";
import { UserPopulated } from "@/types/user";
import styles from "./EventParticipationsList.module.scss";

interface EventParticipationsListProps {
  eventInvitations: EventInvitationPopulated[];
  isLoading?: boolean;
  isUpdating?: boolean;
  onCancel?: (eventInvitationId: string) => void;
}

export default function EventParticipationsList({
  eventInvitations,
  isLoading = false,
  isUpdating = false,
  onCancel,
}: EventParticipationsListProps) {
  if (isLoading) {
    return null;
  }

  if (eventInvitations.length === 0) {
    return null;
  }

  return (
    <div className={styles.list}>
      <ul className={styles.items}>
        {eventInvitations.map((invitation) => {
          if (!invitation.event || !invitation.event._id) return null;
          const event = invitation.event as unknown as EventPopulated;
          const initiator = invitation.initiator as UserPopulated | undefined;
          const hasEventStarted = event.lifecycleStatus !== "upcoming";

          return (
            <li key={invitation._id} className={styles.item}>
              <EventCard
                event={event}
                place={undefined}
                user={initiator}
                clickable={!!event._id}
              />
              {hasEventStarted ? (
                <p className={styles.helperText}>
                  Cet évènement a déjà commencé ou est terminé, votre
                  participation ne peut plus être annulée.
                </p>
              ) : (
                <div className={styles.actions}>
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => onCancel?.(invitation._id)}
                    disabled={isUpdating}
                    ariaLabel="Annuler ma participation"
                  >
                    Annuler ma participation
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
