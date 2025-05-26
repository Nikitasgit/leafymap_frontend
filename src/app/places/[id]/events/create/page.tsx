"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/common/buttons/button/Button";

export default function CreateEventPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const eventData = {
      title: formData.get("title"),
      description: formData.get("description"),
      date: formData.get("date"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
    };

    try {
      const response = await fetch(`/api/places/${params.id}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        router.push(`/places/${params.id}/events`);
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Une erreur est survenue lors de la création de l'événement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Créer un événement</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label htmlFor="title" className="block mb-2">
            Titre
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="date" className="block mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block mb-2">
              Heure de début
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block mb-2">
              Heure de fin
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Création en cours..." : "Créer l'événement"}
          </Button>
          <Button
            type="button"
            onClick={() => router.push(`/places/${params.id}/events`)}
            variant="secondary"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
