import { useState, useEffect } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Partnership } from "@/types/partnerships";

export const usePlacePartnerships = (
  placeId: string,
  queryParams: Record<string, string> = {}
) => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        const searchParams = new URLSearchParams();
        searchParams.append("type", "place");
        Object.entries(queryParams).forEach(([key, value]) => {
          searchParams.append(key, value);
        });

        const url = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/partnerships/${placeId}?${searchParams.toString()}`;

        const response = await axios.get(url, {
          withCredentials: true,
        });

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
  }, [placeId, JSON.stringify(queryParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  return { partnerships, isLoading };
};
