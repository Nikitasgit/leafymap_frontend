import { useState, useEffect } from "react";
import axios from "axios";
import { Place } from "@/types/place";

export const usePlace = (placeId: string, enrichSchedule: boolean = false) => {
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        const url = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/places/${placeId}?enrichSchedule=${enrichSchedule.toString()}`;
        const response = await axios.get(url);
        setPlace(response.data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch place");
        setPlace(null);
      } finally {
        setLoading(false);
      }
    };

    if (placeId) {
      fetchPlace();
    }
  }, [placeId]);

  return { place, loading, error };
};
