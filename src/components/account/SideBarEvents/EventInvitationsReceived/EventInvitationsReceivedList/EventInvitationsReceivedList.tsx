"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import EventCard from "@/components/common/events/EventCard";
import PartnershipCard from "@/components/common/partnerships/PartnershipCard";
import Button from "@/components/common/buttons/Button";
import { EventInvitationPopulated } from "@/types/eventInvitation";
import { EventPopulated } from "@/types/place/event";
import { UserPopulated } from "@/types/user";
import styles from "./EventInvitationsReceivedList.module.scss";

interface EventInvitationsReceivedListProps {
  eventInvitations: EventInvitationPopulated[];
  isLoading?: boolean;
  isUpdating?: boolean;
  onAccept?: (eventInvitationId: string) => void;
  onRefuse?: (eventInvitationId: string) => void;
}

export default function EventInvitationsReceivedList({
  eventInvitations,
  isLoading = false,
  isUpdating = false,
  onAccept,
  onRefuse,
}: EventInvitationsReceivedListProps) {
  const { t } = useTranslation("events");

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
              <div className={styles.eventCardWrapper}>
                <EventCard
                  event={event}
                  place={undefined}
                  user={initiator}
                  clickable={!!event._id}
                />
              </div>
              <div className={styles.bottomRow}>
                <PartnershipCard
                  user={
                    initiator ?? {
                      _id: invitation._id,
                      username: t("eventInvitationsReceivedList.defaultUser"),
                    }
                  }
                  showCategory
                />
                <div className={styles.actions}>
                  <Button
                    type="button"
                    variant="primary"
                    size="small"
                    fullWidth
                    onClick={() => onAccept?.(invitation._id)}
                    disabled={isUpdating}
                    ariaLabel={t("eventInvitationsReceivedList.acceptAriaLabel")}
                  >
                    {t("eventInvitationsReceivedList.accept")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    fullWidth
                    onClick={() => onRefuse?.(invitation._id)}
                    disabled={isUpdating}
                    ariaLabel={t("eventInvitationsReceivedList.refuseAriaLabel")}
                  >
                    {t("eventInvitationsReceivedList.refuse")}
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
