"use client";

import { Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth";
import { useEventInvitationsByUserId } from "../../../hooks/useEventInvitationsByUserId";
import { useEventInvitationActions } from "../../../hooks/useEventInvitationActions";
import EventInvitationsReceivedList from "../eventInvitationsReceivedList";
import { AccountTabShell } from "@/features/account";

export default function EventInvitationsReceivedTab() {
  const { t } = useTranslation("events");
  const { user } = useAuth();
  const { eventInvitations, isLoading, refetch } = useEventInvitationsByUserId(
    user?.id,
    {
      asCollaborator: "true",
      includeCancelledEvents: "false",
      includePastEvents: "false",
      onlyPending: "true",
    }
  );
  const {
    acceptEventInvitation,
    refuseEventInvitation,
    isLoading: isUpdating,
  } = useEventInvitationActions(refetch);

  return (
    <AccountTabShell
      icon={<Inbox size={20} />}
      title={t("eventInvitationsReceivedTab.title")}
      description={t("eventInvitationsReceivedTab.description")}
      isLoading={isLoading}
      isEmpty={eventInvitations.length === 0}
      emptyTitle={t("eventInvitationsReceivedTab.emptyTitle")}
      emptyMessage={t("eventInvitationsReceivedTab.emptyMessage")}
    >
      <EventInvitationsReceivedList
        eventInvitations={eventInvitations}
        isLoading={false}
        isUpdating={isUpdating}
        onAccept={acceptEventInvitation}
        onRefuse={refuseEventInvitation}
      />
    </AccountTabShell>
  );
}
