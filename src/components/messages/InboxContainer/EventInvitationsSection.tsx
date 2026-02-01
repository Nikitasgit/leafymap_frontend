"use client";

import React from "react";
import EventCard from "@/components/common/events/EventCard/EventCard";
import Button from "@/components/common/buttons/Button/Button";
import { PartnershipPopulated } from "@/types/partnerships";
import { UserPopulated } from "@/types/user";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserEventsPartnershipsByUserId } from "@/hooks/useUserEventsPartnershipsByUserId";
import { usePartnershipActions } from "@/hooks/usePartnershipActions";
import styles from "./InboxContainer.module.scss";

function isFullEvent(
  event: PartnershipPopulated["event"]
): event is NonNullable<PartnershipPopulated["event"]> & { _id: string } {
  return !!event && typeof event === "object" && "_id" in event;
}

export default function EventInvitationsSection() {
  const { user } = useCurrentUser();
  const { partnerships, isLoading, refetch } =
    useUserEventsPartnershipsByUserId(user?._id, {
      asCollaborator: "true",
      includeCancelledEvents: "false",
      includePastEvents: "false",
      onlyAccepted: "false",
      onlyPending: "true",
    });
  const {
    acceptPartnership,
    refusePartnership,
    isLoading: isUpdating,
  } = usePartnershipActions(refetch);

  if (!user) return null;

  const pendingEventPartnerships = partnerships.filter(
    (p: PartnershipPopulated) => p.status === "pending"
  );

  if (isLoading) return null;
  if (pendingEventPartnerships.length === 0) return null;

  return (
    <section className={styles.invitationSection}>
      <h2 className={styles.sectionTitle}>Invitations évènements</h2>
      <div className={styles.partnershipsList}>
        {partnerships.map((partnership) => {
          if (!isFullEvent(partnership.event)) return null;
          const event = partnership.event;
          const place = partnership.place;
          const initiator = partnership.initiator;
          return (
            <div key={partnership._id} className={styles.invitationCardWrapper}>
              <EventCard
                event={event}
                place={
                  typeof place === "object" && place && "_id" in place
                    ? place
                    : undefined
                }
                user={initiator as UserPopulated | undefined}
                clickable={!!event._id}
              />
              <div className={styles.invitationCardActions}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => acceptPartnership(partnership._id)}
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
                  onClick={() => refusePartnership(partnership._id)}
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
