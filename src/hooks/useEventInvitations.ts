import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { EventInvitationPopulated } from "@/types/eventInvitation";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useEventInvitations = (
  eventId?: string,
  queryParams: Record<string, string> = {}
) => {
  const [eventInvitations, setEventInvitations] = useState<
    EventInvitationPopulated[]
  >([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const { t } = useTranslation("events");

  useEffect(() => {
    const fetchEventInvitations = async () => {
      const searchParams = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        searchParams.append(key, value);
      });
      try {
        const url = `/api/event-invitations/event/${eventId}?${searchParams.toString()}`;

        const response = await apiClient.get(url);

        if (response.data && response.data.data) {
          setEventInvitations(response.data.data);
        } else {
          setEventInvitations([]);
          showError(t("eventInvitations.invalidResponse"));
        }
      } catch (err) {
        showError(
          getErrorMessage(err, t, t("eventInvitations.loadError"))
        );
        setEventInvitations([]);
      }
    };

    if (eventId) {
      withLoading(fetchEventInvitations);
    } else {
      setEventInvitations([]);
    }
  }, [eventId, JSON.stringify(queryParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  return { eventInvitations, isLoading };
};
