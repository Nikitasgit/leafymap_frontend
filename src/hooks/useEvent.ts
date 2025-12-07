import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { EventPopulated } from "@/types/place/event";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useEvent = (eventId: string) => {
  const [event, setEvent] = useState<EventPopulated | null>(null);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const showErrorRef = useRef(showError);

  // Keep ref updated
  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`
      );

      if (response.data && response.data.data) {
        setEvent(response.data.data);
      } else {
        setEvent(null);
        showErrorRef.current("Invalid response from server");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement de l'événement";
      setEvent(null);
      showErrorRef.current(errorMessage);
    }
  }, [eventId]);

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
