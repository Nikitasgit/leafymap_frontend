import { useState, useEffect } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Partnership } from "@/types/partnerships";

export const usePartnershipByUserId = (
  userId?: string,
  queryParams: Record<string, string> = {}
) => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  const fetchPartnerships = async () => {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    try {
      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/partnerships/user/${userId}?${searchParams.toString()}`;

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
          : "Erreur lors du chargement des partenariats";
      setPartnerships([]);
      showError(errorMessage);
    }
  };

  useEffect(() => {
    if (userId) {
      withLoading(fetchPartnerships);
    }
  }, [userId]);

  return { partnerships, isLoading, refetch: fetchPartnerships };
};
