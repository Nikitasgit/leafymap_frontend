"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth";
import { usePartnershipsReceived } from "../../hooks/usePartnershipsReceived";
import { usePartnershipInvitationActions } from "../../hooks/usePartnershipInvitationActions";
import PartnershipsReceivedList from "../partnershipsReceivedList";
import EmptyState from "@/shared/ui/noResults/emptyState";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import styles from "./PartnershipsReceivedTab.module.scss";

export default function PartnershipsReceivedTab() {
  const { t } = useTranslation("account");
  const { user } = useAuth();
  const { partnerships, isLoading, refetch } = usePartnershipsReceived(
    user?.id,
    { status: "pending" },
  );
  const {
    acceptPartnershipInvitation,
    refusePartnershipInvitation,
    isLoading: isUpdating,
  } = usePartnershipInvitationActions(refetch);

  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.invitationsReceivedContent}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <p className={styles.label}>
            <Inbox size={20} className={styles.icon} />
            {t("partnershipsReceivedTab.label")}
          </p>
          <p className={styles.info}>{t("partnershipsReceivedTab.info")}</p>
        </div>
      </div>
      {partnerships.length === 0 ? (
        <EmptyState
          title={t("partnershipsReceivedTab.emptyTitle")}
          description={t("partnershipsReceivedTab.emptyDescription")}
          icon={<Inbox className={styles.emptyIcon} />}
        />
      ) : (
        <PartnershipsReceivedList
          partnerships={partnerships}
          isLoading={false}
          isUpdating={isUpdating}
          onAccept={acceptPartnershipInvitation}
          onRefuse={refusePartnershipInvitation}
        />
      )}
    </div>
  );
}
