"use client";

import React, { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth";
import { useEventInvitationsByUserId } from "../../../hooks/useEventInvitationsByUserId";
import { useEventInvitationActions } from "../../../hooks/useEventInvitationActions";
import EventParticipationsList from "../eventParticipationsList";
import BaseModal from "@/shared/ui/modals/baseModal";
import EmptyState from "@/shared/ui/noResults/emptyState";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import styles from "./EventParticipationsTab.module.scss";

export default function EventParticipationsTab() {
  const { t } = useTranslation("events");
  const { user } = useAuth();
  const { eventInvitations, isLoading, refetch } = useEventInvitationsByUserId(
    user?.id,
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
            {t("eventParticipationsTab.title")}
          </p>
          <p className={styles.info}>{t("eventParticipationsTab.description")}</p>
        </div>
      </div>
      {eventInvitations.length === 0 ? (
        <EmptyState
          title={t("eventParticipationsTab.emptyTitle")}
          description={t("eventParticipationsTab.emptyDescription")}
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
        title={t("eventParticipationsTab.cancelModalTitle")}
        primaryButtonLabel={t("eventParticipationsTab.cancelModalPrimary")}
        secondaryButtonLabel={t("common:actions.back")}
        onPrimaryAction={handleCancel}
        primaryButtonType="button"
        isSubmitLoading={isCancelling}
        withLoadingState={false}
      >
        <p>{t("eventParticipationsTab.cancelModalBody")}</p>
      </BaseModal>
    </div>
  );
}
