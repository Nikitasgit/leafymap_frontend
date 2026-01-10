"use client";

import React from "react";
import { Calendar } from "lucide-react";
import PartnershipMessage from "@/components/messages/PartnershipMessage";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { PartnershipPopulated } from "@/types/partnerships";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserEventsPartnershipsByUserId } from "@/hooks/useUserEventsPartnershipsByUserId";
import { useSubmitPartnerships } from "@/hooks/useSubmitPartnerships";
import styles from "./EventInvitationsTab.module.scss";
import EmptyState from "@/components/common/noResults/EmptyState";

export default function EventInvitationsTab() {
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const {
    partnerships,
    isLoading: isLoadingPartnerships,
    refetch,
  } = useUserEventsPartnershipsByUserId(user?._id, {
    asCollaborator: "true",
    includeCancelledEvents: "false",
    includePastEvents: "false",
    onlyAccepted: "false",
  });

  const { submitPartnerships } = useSubmitPartnerships(refetch);

  const isLoading = isLoadingUser || isLoadingPartnerships;

  if (isLoading) {
    return <LoadingBar />;
  }

  if (!user) {
    return null;
  }

  const pendingEventPartnerships = partnerships.filter(
    (p: PartnershipPopulated) => p.status === "pending"
  );
  const acceptedEventPartnerships = partnerships.filter(
    (p: PartnershipPopulated) => p.status === "accepted"
  );
  const refusedEventPartnerships = partnerships.filter(
    (p: PartnershipPopulated) => p.status === "refused"
  );

  return (
    <div className={styles.content}>
      {pendingEventPartnerships.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Invitations en attente ({pendingEventPartnerships.length})
          </h2>
          <div className={styles.partnershipsList}>
            {pendingEventPartnerships.map((partnership) => (
              <PartnershipMessage
                key={partnership._id}
                partnership={partnership}
                currentUser={user}
                onStatusChange={submitPartnerships}
                isLoading={false}
              />
            ))}
          </div>
        </section>
      )}

      {acceptedEventPartnerships.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Invitations acceptées ({acceptedEventPartnerships.length})
          </h2>
          <div className={styles.partnershipsList}>
            {acceptedEventPartnerships.map((partnership) => (
              <PartnershipMessage
                key={partnership._id}
                partnership={partnership}
                currentUser={user}
                onStatusChange={submitPartnerships}
                isLoading={false}
              />
            ))}
          </div>
        </section>
      )}

      {refusedEventPartnerships.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Invitations refusées ({refusedEventPartnerships.length})
          </h2>
          <div className={styles.partnershipsList}>
            {refusedEventPartnerships.map((partnership) => (
              <PartnershipMessage
                key={partnership._id}
                partnership={partnership}
                currentUser={user}
                onStatusChange={submitPartnerships}
                isLoading={false}
              />
            ))}
          </div>
        </section>
      )}

      {partnerships.length === 0 && (
        <EmptyState
          title="Aucune invitation d'événement"
          description="Vous n'avez pas d'invitations à des événements. Lorsque les organisateurs vous invitent à collaborer sur un événement, les invitations apparaîtront ici."
          icon={<Calendar size={64} />}
        />
      )}
    </div>
  );
}
