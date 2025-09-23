import { useState, useEffect } from "react";
import axios from "axios";
import { EventPopulated } from "@/types/place/event";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useEvent = (eventId: string) => {
  const [event, setEvent] = useState<EventPopulated | null>(null);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`
        );

        if (response.data && response.data.data) {
          setEvent(response.data.data);
        } else {
          setEvent(null);
          showError("Invalid response from server");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement de l'événement";
        setEvent(null);
        showError(errorMessage);
      }
    };

    if (eventId) {
      withLoading(fetchEvent);
    }
  }, [eventId]);

  return { event, isLoading };
};
