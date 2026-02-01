"use client";

import React from "react";
import { Handshake } from "lucide-react";
import PartnershipMessage from "@/components/messages/PartnershipMessage";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { PartnershipPopulated } from "@/types/partnerships";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserPlacesPartnershipsByUserId } from "@/hooks/useUserPlacesPartnershipsByUserId";
import styles from "./PartnershipsTab.module.scss";
import EmptyState from "@/components/common/noResults/EmptyState";

export default function PartnershipsTab() {
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const { partnerships, isLoading: isLoadingPartnerships } =
    useUserPlacesPartnershipsByUserId(user?._id, {
      asCollaborator: "true",
      onlyAccepted: "false",
    });

  const isLoading = isLoadingUser || isLoadingPartnerships;

  if (isLoading) {
    return <LoadingBar />;
  }

  if (!user) {
    return null;
  }

  const pendingPlacePartnerships = partnerships.filter(
    (p: PartnershipPopulated) => p.status === "pending"
  );
  const acceptedPlacePartnerships = partnerships.filter(
    (p: PartnershipPopulated) => p.status === "accepted"
  );
  const refusedPlacePartnerships = partnerships.filter(
    (p: PartnershipPopulated) => p.status === "refused"
  );

  return (
    <div className={styles.content}>
      {pendingPlacePartnerships.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Partenariats en attente ({pendingPlacePartnerships.length})
          </h2>
          <div className={styles.partnershipsList}>
            {pendingPlacePartnerships.map((partnership) => (
              <PartnershipMessage
                key={partnership._id}
                partnership={partnership}
              />
            ))}
          </div>
        </section>
      )}

      {acceptedPlacePartnerships.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Partenariats acceptés ({acceptedPlacePartnerships.length})
          </h2>
          <div className={styles.partnershipsList}>
            {acceptedPlacePartnerships.map((partnership) => (
              <PartnershipMessage
                key={partnership._id}
                partnership={partnership}
              />
            ))}
          </div>
        </section>
      )}

      {refusedPlacePartnerships.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Partenariats refusés ({refusedPlacePartnerships.length})
          </h2>
          <div className={styles.partnershipsList}>
            {refusedPlacePartnerships.map((partnership) => (
              <PartnershipMessage
                key={partnership._id}
                partnership={partnership}
              />
            ))}
          </div>
        </section>
      )}

      {partnerships.length === 0 && (
        <EmptyState
          title="Aucun partenariat"
          description="Vous n'avez pas de partenariats de lieu. Lorsque les organisateurs vous proposent des partenariats, ils apparaîtront ici."
          icon={<Handshake size={64} />}
        />
      )}
    </div>
  );
}
