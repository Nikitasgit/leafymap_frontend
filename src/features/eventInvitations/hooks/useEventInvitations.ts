import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchEventInvitationsByEvent } from "../api/eventInvitationsApi";
import { EventInvitationPopulated } from "../types/eventInvitation";

export const useEventInvitations = (
  eventId?: string,
  queryParams: Record<string, string> = {},
) => {
  const { t } = useTranslation("events");
  const queryKey = JSON.stringify(queryParams);

  const { data: eventInvitations, isLoading } = useApiQuery<
    EventInvitationPopulated[]
  >(
    () => {
      // Reconstruit les params depuis queryKey (string stable) pour ne pas
      // dépendre de la référence de l'objet queryParams dans l'effet.
      const parsedParams: Record<string, string> = JSON.parse(queryKey);
      return fetchEventInvitationsByEvent(eventId as string, parsedParams);
    },
    {
      initialData: [],
      enabled: !!eventId,
      deps: [eventId, queryKey],
      errorMessage: t("eventInvitations.loadError"),
    },
  );

  return { eventInvitations, isLoading };
};
