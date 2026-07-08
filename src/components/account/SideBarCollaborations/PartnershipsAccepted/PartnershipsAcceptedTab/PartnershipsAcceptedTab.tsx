"use client";

import React from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePartnershipsAccepted } from "@/hooks/usePartnershipsAccepted";
import useDeletePartnership from "@/hooks/useDeletePartnership";
import PartnershipCard from "@/components/common/partnerships/PartnershipCard";
import LoadingBar from "@/components/common/loading/LoadingBar";
import EmptyState from "@/components/common/noResults/EmptyState";
import { Users } from "lucide-react";
import { Partnership } from "@/types/partnerships";
import styles from "./PartnershipsAcceptedTab.module.scss";

function getOtherUser(partnership: Partnership, currentUserId: string) {
  const initiatorId =
    typeof partnership.initiator === "object" && partnership.initiator
      ? partnership.initiator._id
      : partnership.initiator;
  const isCurrentUserInitiator = initiatorId === currentUserId;
  return isCurrentUserInitiator
    ? partnership.collaborator
    : partnership.initiator;
}

export default function PartnershipsAcceptedTab() {
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const {
    partnerships,
    isLoading: isLoadingPartnerships,
    refetch,
  } = usePartnershipsAccepted(user?._id);
  const { deletePartnership } = useDeletePartnership(refetch);

  if (isLoadingUser || isLoadingPartnerships) {
    return <LoadingBar />;
  }

  if (!user) {
    return null;
  }

  const acceptedPartnerships = partnerships.filter(
    (p) => p.status === "accepted" && !p.deleted
  );

  return (
    <div className={styles.partnershipsAcceptedTab}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <p className={styles.label}>
            <Users size={20} className={styles.icon} />
            Mes collaborateurs
          </p>
          <p className={styles.info}>
            Liste des personnes avec qui vous collaborez.
          </p>
        </div>
      </div>

      {acceptedPartnerships.length === 0 ? (
        <EmptyState
          title="Aucune collaboration"
          description="Vous n'avez pas de collaborateurs pour le moment."
        />
      ) : (
        <ul className={styles.items}>
          {acceptedPartnerships.map((partnership) => {
            const otherUser = getOtherUser(partnership, user._id);
            if (!otherUser || typeof otherUser !== "object") return null;
            return (
              <li key={partnership._id} className={styles.item}>
                <PartnershipCard
                  user={otherUser}
                  showCategory
                  actions={[
                    {
                      label: "Supprimer",
                      onClick: () => deletePartnership(partnership._id),
                    },
                  ]}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
