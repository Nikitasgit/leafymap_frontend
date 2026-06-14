import { useEffect, useState } from "react";
import axios from "axios";
import { EventPopulated } from "@/types/place/event";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useUserEvents = (
  userId: string | null,
  lifecycleStatus?: ("upcoming" | "ongoing" | "completed" | "unvalid")[]
) => {
  const [events, setEvents] = useState<EventPopulated[]>([]);
  const { isLoading, withLoading, stopLoading } = useLoading(true);
  const { showError } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/events?userId=${userId}`;

        if (lifecycleStatus && lifecycleStatus.length > 0) {
          url += `&lifecycleStatus=${lifecycleStatus.join(",")}`;
        }

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

    if (userId) {
      withLoading(fetchEvents);
    } else {
      setEvents([]);
      stopLoading();
    }
  }, [userId, lifecycleStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  return { events, isLoading };
};
