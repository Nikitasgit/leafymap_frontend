import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { EventPopulated } from "@/types/place/event";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useUserEvents = (
  userId: string | null,
  lifecycleStatus?: ("upcoming" | "ongoing" | "completed" | "unvalid")[]
) => {
  const [events, setEvents] = useState<EventPopulated[]>([]);
  const { isLoading, withLoading, stopLoading } = useLoading(true);
  const { showError } = useToast();
  const { t } = useTranslation("events");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let url = `/api/events?userId=${userId}`;

        if (lifecycleStatus && lifecycleStatus.length > 0) {
          url += `&lifecycleStatus=${lifecycleStatus.join(",")}`;
        }

        const response = await apiClient.get(url);

        if (response.data && response.data.data) {
          setEvents(response.data.data);
        } else {
          setEvents([]);
          showError(t("userEvents.invalidResponse"));
        }
      } catch (err) {
        showError(getErrorMessage(err, t, t("userEvents.loadError")));
        setEvents([]);
      }
    };

    if (userId) {
      withLoading(fetchEvents);
    } else {
      setEvents([]);
      stopLoading();
    }
  }, [userId, lifecycleStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  return { events, isLoading };
};
