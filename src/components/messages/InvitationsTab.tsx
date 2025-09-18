"use client";

import React from "react";
import { Handshake } from "lucide-react";
import Text from "@/components/common/typography/Text";
import PartnershipMessage from "@/components/messages/PartnershipMessage";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { Partnership, PartnershipPopulated } from "@/types/partnerships";
import { User } from "@/types/user";
import styles from "./InvitationsTab.module.scss";

interface InvitationsTabProps {
  partnerships: PartnershipPopulated[];
  currentUser: User;
  isLoading: boolean;
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
}: InvitationsTabProps) {
  if (isLoading) {
    return <LoadingBar />;
  }

  const pendingPartnerships = partnerships.filter(
    (p) => p.status === "pending" && !p.deleted
  );
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
          <Text as="h2" className={styles.sectionTitle}>
            Pending Partnerships ({pendingPartnerships.length})
          </Text>
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
          <Text as="h2" className={styles.sectionTitle}>
            Invitations acceptées ({acceptedPartnerships.length})
          </Text>
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
          <Text as="h2" className={styles.sectionTitle}>
            Invitations refusées ({refusedPartnerships.length})
          </Text>
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
        <div className={styles.emptyState}>
          <Handshake size={64} className={styles.emptyIcon} />
          <Text as="h2" className={styles.emptyTitle}>
            Aucune invitation de partenariat
          </Text>
          <Text as="p" className={styles.emptyDescription}>
            Vous n&apos;avez aucune invitation de partenariat. Lorsque les
            organisateurs vous envoient des demandes de partenariat, elles
            apparaîtront ici.
          </Text>
        </div>
      )}
    </div>
  );
}
