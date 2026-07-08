"use client";

import React, { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEventInvitationsByUserId } from "@/hooks/useEventInvitationsByUserId";
import { useEventInvitationActions } from "@/hooks/useEventInvitationActions";
import EventParticipationsList from "../EventParticipationsList";
import BaseModal from "@/components/common/modals/BaseModal";
import EmptyState from "@/components/common/noResults/EmptyState";
import LoadingBar from "@/components/common/loading/LoadingBar";
import styles from "./EventParticipationsTab.module.scss";

export default function EventParticipationsTab() {
  const { user } = useAuth();
  const { eventInvitations, isLoading, refetch } = useEventInvitationsByUserId(
    user?._id,
    {
      asCollaborator: "true",
      includeCancelledEvents: "false",
      includePastEvents: "false",
      onlyAccepted: "true",
    }
  );
  const { cancelEventInvitation, isLoading: isCancelling } =
    useEventInvitationActions(refetch);
  const [cancellingInvitationId, setCancellingInvitationId] = useState<
    string | null
  >(null);

  const handleCancel = async () => {
    if (!cancellingInvitationId) return;
    await cancelEventInvitation(cancellingInvitationId);
    setCancellingInvitationId(null);
  };

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
          isUpdating={isCancelling}
          onCancel={setCancellingInvitationId}
        />
      )}

      <BaseModal
        isOpen={cancellingInvitationId !== null}
        onClose={() => setCancellingInvitationId(null)}
        title="Annuler votre participation ?"
        primaryButtonLabel="Annuler ma participation"
        secondaryButtonLabel="Retour"
        onPrimaryAction={handleCancel}
        primaryButtonType="button"
        isSubmitLoading={isCancelling}
        withLoadingState={false}
      >
        <p>
          Vous ne participerez plus à cet évènement. L&apos;organisateur en
          sera informé.
        </p>
      </BaseModal>
    </div>
  );
}
