"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/common/buttons/button/Button";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
}

export default function EventsListPage() {
  const params = useParams();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/places/${params.id}/events`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Événements</h1>
        <Button onClick={() => router.push(`/places/${params.id}/events`)}>
          Ajouter un événement
        </Button>
      </div>

      {events.length === 0 ? (
        <p>Aucun événement trouvé</p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event._id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600 mt-2">{event.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>
                  Heure: {event.startTime} - {event.endTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
