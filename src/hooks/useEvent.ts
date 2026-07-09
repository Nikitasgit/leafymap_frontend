import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api/client";
import { EventPopulated } from "@/types/place/event";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useEvent = (eventId: string) => {
  const [event, setEvent] = useState<EventPopulated | null>(null);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const { t } = useTranslation("events");
  const showErrorRef = useRef(showError);

  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/events/${eventId}`);

      if (response.data && response.data.data) {
        setEvent(response.data.data);
      } else {
        setEvent(null);
        showErrorRef.current(t("errors:invalidResponse"));
      }
    } catch (err) {
      setEvent(null);
      showErrorRef.current(
        getErrorMessage(err, t, t("useEvent.loadError")),
      );
    }
  }, [eventId, t]);

  useEffect(() => {
    if (eventId) {
      withLoading(fetchEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const refetch = useCallback(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId, fetchEvent]);

  return { event, isLoading, refetch };
};
