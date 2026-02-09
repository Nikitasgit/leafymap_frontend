"use client";

import React from "react";
import EventCard from "@/components/common/events/EventCard/EventCard";
import { EventInvitationPopulated } from "@/types/eventInvitation";
import { EventPopulated } from "@/types/place/event";
import { UserPopulated } from "@/types/user";
import styles from "./EventParticipationsList.module.scss";

interface EventParticipationsListProps {
  eventInvitations: EventInvitationPopulated[];
  isLoading?: boolean;
}

export default function EventParticipationsList({
  eventInvitations,
  isLoading = false,
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
          return (
            <li key={invitation._id} className={styles.item}>
              <EventCard
                event={event}
                place={undefined}
                user={initiator}
                clickable={!!event._id}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
