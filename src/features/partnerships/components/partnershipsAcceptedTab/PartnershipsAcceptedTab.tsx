"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/features/auth";
import { usePartnershipsAccepted } from "../../hooks/usePartnershipsAccepted";
import useDeletePartnership from "../../hooks/useDeletePartnership";
import PartnershipCard from "../partnershipCard";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import EmptyState from "@/shared/ui/noResults/emptyState";
import { Users } from "lucide-react";
import type { Partnership } from "../../types";
import styles from "./PartnershipsAcceptedTab.module.scss";
import { resolveRefId } from "@/shared/api/normalizers/resolveRef";

function getOtherUser(partnership: Partnership, currentUserId: string) {
  const initiatorId = resolveRefId(partnership.initiator);
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
    (p) => p.status === "accepted" && !p.deleted,
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
