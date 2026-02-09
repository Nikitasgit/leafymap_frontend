"use client";

import React from "react";
import { CalendarCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEventInvitationsByUserId } from "@/hooks/useEventInvitationsByUserId";
import EventParticipationsList from "../EventParticipationsList";
import EmptyState from "@/components/common/noResults/EmptyState";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import styles from "./EventParticipationsTab.module.scss";

export default function EventParticipationsTab() {
  const { user } = useAuth();
  const { eventInvitations, isLoading } = useEventInvitationsByUserId(
    user?._id,
    {
      asCollaborator: "true",
      includeCancelledEvents: "false",
      includePastEvents: "false",
      onlyAccepted: "true",
    }
  );

  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.participationsContent}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <p className={styles.label}>
            <CalendarCheck size={20} className={styles.icon} />
            Mes participations
          </p>
          <p className={styles.info}>
            Les évènements auxquels vous participez en tant que collaborateur.
          </p>
        </div>
      </div>
      {eventInvitations.length === 0 ? (
        <EmptyState
          title="Aucune participation"
          description="Vous ne participez à aucun évènement pour le moment."
          icon={<CalendarCheck className={styles.emptyIcon} />}
        />
      ) : (
        <EventParticipationsList
          eventInvitations={eventInvitations}
          isLoading={false}
        />
      )}
    </div>
  );
}
