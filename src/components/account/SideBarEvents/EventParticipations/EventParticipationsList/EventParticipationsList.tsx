"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import EventCard from "@/components/common/events/EventCard";
import Button from "@/components/common/buttons/Button";
import { EventInvitationPopulated } from "@/types/eventInvitation";
import { EventPopulated } from "@/types/place/event";
import { UserPopulated } from "@/types/user";
import { useBookingLimits } from "@/hooks/useBookingLimits";
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
          if (!invitation.event || !invitation.event.id) return null;
          const event = invitation.event as unknown as EventPopulated;
          const initiator = invitation.initiator as UserPopulated | undefined;

          return (
            <ParticipationListItem
              key={invitation.id}
              invitationId={invitation.id}
              event={event}
              initiator={initiator}
              isUpdating={isUpdating}
              onCancel={onCancel}
            />
          );
        })}
      </ul>
    </div>
  );
}

interface ParticipationListItemProps {
  invitationId: string;
  event: EventPopulated;
  initiator?: UserPopulated;
  isUpdating: boolean;
  onCancel?: (eventInvitationId: string) => void;
}

function ParticipationListItem({
  invitationId,
  event,
  initiator,
  isUpdating,
  onCancel,
}: ParticipationListItemProps) {
  const { t } = useTranslation("events");
  const { canEdit, lockedParticipationMessage } = useBookingLimits({
    maxSeatsPerBooking: event.maxSeatsPerBooking || 1,
    remainingSeats: event.remainingSeats ?? null,
    lifecycleStatus: event.lifecycleStatus,
  });

  return (
    <li className={styles.item}>
      <EventCard
        event={event}
        place={undefined}
        user={initiator}
        clickable={!!event.id}
      />
      {!canEdit ? (
        <p className={styles.helperText}>{lockedParticipationMessage}</p>
      ) : (
        <div className={styles.actions}>
          <Button
            type="button"
            variant="danger"
            size="small"
            onClick={() => onCancel?.(invitationId)}
            disabled={isUpdating}
            ariaLabel={t("eventParticipationsList.cancelParticipationAriaLabel")}
          >
            {t("eventParticipationsList.cancelParticipation")}
          </Button>
        </div>
      )}
    </li>
  );
}
