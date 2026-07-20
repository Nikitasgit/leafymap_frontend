"use client";

import React from "react";
import { useTranslation } from "react-i18next";
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
      ? partnership.initiator.id
      : partnership.initiator;
  const isCurrentUserInitiator = initiatorId === currentUserId;
  return isCurrentUserInitiator
    ? partnership.collaborator
    : partnership.initiator;
}

export default function PartnershipsAcceptedTab() {
  const { t } = useTranslation("account");
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const {
    partnerships,
    isLoading: isLoadingPartnerships,
    refetch,
  } = usePartnershipsAccepted(user?.id);
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
            {t("partnershipsAcceptedTab.label")}
          </p>
          <p className={styles.info}>{t("partnershipsAcceptedTab.info")}</p>
        </div>
      </div>

      {acceptedPartnerships.length === 0 ? (
        <EmptyState
          title={t("partnershipsAcceptedTab.emptyTitle")}
          description={t("partnershipsAcceptedTab.emptyDescription")}
        />
      ) : (
        <ul className={styles.items}>
          {acceptedPartnerships.map((partnership) => {
            const otherUser = getOtherUser(partnership, user.id);
            if (!otherUser || typeof otherUser !== "object") return null;
            return (
              <li key={partnership.id} className={styles.item}>
                <PartnershipCard
                  user={otherUser}
                  showCategory
                  actions={[
                    {
                      label: t("common:actions.delete"),
                      onClick: () => deletePartnership(partnership.id),
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
