import { Collaborator } from "@/types/place/collaborators";
import { useState, useEffect } from "react";

interface Event {
  _id: string;
  name: string;
  description: string;
  image: string;
  schedule: {
    startDate: string;
    endDate: string;
    timeSlots: {
      title: string;
      startTime: string;
      endTime: string;
      participants: string[];
    }[];
  }[];
  collaborators: Collaborator[];
}

export const usePlaceEvents = (placeId: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}/events`
        );
        const data = await response.json();
        setEvents(data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [placeId]);

  return { events, loading };
};
