import { useState, useEffect } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Partnership } from "@/types/partnerships";

export const usePlacePartnerships = (
  placeId: string,
  eventId?: string,
  type: "place" | "event" = "place",
  onlyAccepted: boolean = false
) => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        const url = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/partnerships/${placeId}${
          eventId ? `/${eventId}` : ""
        }?type=${type}${
          onlyAccepted ? `&onlyAccepted=${onlyAccepted.toString()}` : ""
        }`;

        const response = await axios.get(url);

        if (response.data && response.data.data) {
          setPartnerships(response.data.data);
        } else {
          setPartnerships([]);
          showError("Invalid response from server");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement du lieu";
        setPartnerships([]);
        showError(errorMessage);
      }
    };

    if (placeId) {
      withLoading(fetchPartnerships);
    }
  }, [placeId, eventId]);

  return { partnerships, isLoading };
};
