"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePartnershipsReceived } from "@/hooks/usePartnershipsReceived";
import { usePartnershipInvitationActions } from "@/hooks/usePartnershipInvitationActions";
import PartnershipsReceivedList from "../PartnershipsReceivedList";
import EmptyState from "@/components/common/noResults/EmptyState";
import LoadingBar from "@/components/common/loading/LoadingBar";
import styles from "./PartnershipsReceivedTab.module.scss";

export default function PartnershipsReceivedTab() {
  const { user } = useAuth();
  const { partnerships, isLoading, refetch } = usePartnershipsReceived(
    user?._id,
    { status: "pending" }
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
            Invitations reçues
          </p>
          <p className={styles.info}>
            Acceptez ou refusez les demandes de collaboration qui vous sont
            envoyées.
          </p>
        </div>
      </div>
      {partnerships.length === 0 ? (
        <EmptyState
          title="Aucune invitation reçue"
          description="Les invitations en attente apparaîtront ici."
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
