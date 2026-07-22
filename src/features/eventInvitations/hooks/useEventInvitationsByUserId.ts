import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchEventInvitationsByUserId } from "../api/eventInvitationsApi";
import { EventInvitationPopulated } from "../types/eventInvitation";

export const useEventInvitationsByUserId = (
  userId?: string,
  queryParams: Record<string, string> = {},
) => {
  const { t } = useTranslation("events");

  const {
    data: eventInvitations,
    isLoading,
    refetch,
  } = useApiQuery<EventInvitationPopulated[]>(
    () => fetchEventInvitationsByUserId(userId as string, queryParams),
    {
      initialData: [],
      enabled: !!userId,
      deps: [userId],
      errorMessage: t("eventInvitationsByUserId.loadError"),
    },
  );

  return { eventInvitations, isLoading, refetch };
};
