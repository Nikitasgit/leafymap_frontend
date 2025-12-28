import { useState, useEffect } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { EventPopulated } from "@/types/place/event";

export const usePlaceEvents = (placeId: string | null) => {
  const [events, setEvents] = useState<EventPopulated[]>([]);
  const { isLoading, withLoading, stopLoading } = useLoading(true);
  const { showError } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/events?placeId=${placeId}`;

        const response = await axios.get(url);

        if (response.data && response.data.data) {
          setEvents(response.data.data);
        } else {
          setEvents([]);
          showError("Invalid response from server");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des événements";
        setEvents([]);
        showError(errorMessage);
      }
    };

    if (placeId) {
      withLoading(fetchEvents);
    } else {
      setEvents([]);
      stopLoading();
    }
  }, [placeId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { events, isLoading };
};
