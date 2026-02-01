import { useState, useEffect } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { EventInvitationPopulated } from "@/types/eventInvitation";

export const useEventInvitationsByUserId = (
  userId?: string,
  queryParams: Record<string, string> = {}
) => {
  const [eventInvitations, setEventInvitations] = useState<
    EventInvitationPopulated[]
  >([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  const fetchEventInvitations = async () => {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    try {
      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/event-invitations/user/${userId}?${searchParams.toString()}`;

      const response = await axios.get(url, {
        withCredentials: true,
      });
      if (response.data && response.data.data) {
        setEventInvitations(response.data.data);
      } else {
        setEventInvitations([]);
        showError("Invalid response from server");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des invitations d'événements";
      setEventInvitations([]);
      showError(errorMessage);
    }
  };

  useEffect(() => {
    if (userId) {
      withLoading(fetchEventInvitations);
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    eventInvitations,
    isLoading,
    refetch: fetchEventInvitations,
  };
};
