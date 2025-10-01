"use client";

import React from "react";
import { Handshake } from "lucide-react";
import PartnershipMessage from "@/components/messages/PartnershipMessage";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { Partnership, PartnershipPopulated } from "@/types/partnerships";
import { UserPopulated } from "@/types/user";
import styles from "./InvitationsTab.module.scss";
import EmptyState from "@/components/common/noResults/EmptyState";

interface InvitationsTabProps {
  partnerships: PartnershipPopulated[];
  currentUser: UserPopulated;
  isLoading: boolean;
  pendingPartnerships: PartnershipPopulated[];
  onStatusChange: (
    partnerships: Partnership[],
    isUpdate: boolean,
    placeId: string,
    eventId: string
  ) => void;
}

export default function InvitationsTab({
  partnerships,
  currentUser,
  isLoading,
  onStatusChange,
  pendingPartnerships,
}: InvitationsTabProps) {
  if (isLoading) {
    return <LoadingBar />;
  }

  const acceptedPartnerships = partnerships.filter(
    (p) => p.status === "accepted" && !p.deleted
  );
  const refusedPartnerships = partnerships.filter(
    (p) => p.status === "refused" && !p.deleted
  );

  return (
    <div className={styles.content}>
      {pendingPartnerships.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Invitations en attente ({pendingPartnerships.length})
          </h2>
          <div className={styles.partnershipsList}>
            {pendingPartnerships.map((partnership) => (
              <PartnershipMessage
                key={partnership._id}
                partnership={partnership}
                currentUser={currentUser}
                onStatusChange={onStatusChange}
                isLoading={false}
              />
            ))}
          </div>
        </section>
      )}

      {acceptedPartnerships.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Invitations acceptées ({acceptedPartnerships.length})
          </h2>
          <div className={styles.partnershipsList}>
            {acceptedPartnerships.map((partnership) => (
              <PartnershipMessage
                key={partnership._id}
                partnership={partnership}
                currentUser={currentUser}
                onStatusChange={onStatusChange}
                isLoading={false}
              />
            ))}
          </div>
        </section>
      )}

      {refusedPartnerships.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Invitations refusées ({refusedPartnerships.length})
          </h2>
          <div className={styles.partnershipsList}>
            {refusedPartnerships.map((partnership) => (
              <PartnershipMessage
                key={partnership._id}
                partnership={partnership}
                currentUser={currentUser}
                onStatusChange={onStatusChange}
                isLoading={false}
              />
            ))}
          </div>
        </section>
      )}

      {partnerships.length === 0 && (
        <EmptyState
          title="Aucune invitation"
          description="Vous n'avez pas d'invitations, lorsque les organisateurs vous envoient des demandes de partenariat, elles apparaîtront ici."
          icon={<Handshake size={64} />}
        />
      )}
    </div>
  );
}
