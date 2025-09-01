import { useState, useEffect } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Partnership } from "@/types/partnerships";

export const usePartnershipByUserId = (
  userId?: string,
  queryParams: Record<string, string> = {}
) => {
  const [partnerships, setPartnerships] = useState<{
    eventPartnerships: Partnership[];
    placePartnerships: Partnership[];
  }>({ eventPartnerships: [], placePartnerships: [] });
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  useEffect(() => {
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
        console.log(response);
        if (response.data && response.data.data) {
          setPartnerships(response.data.data);
        } else {
          setPartnerships({ eventPartnerships: [], placePartnerships: [] });
          showError("Invalid response from server");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des partenariats";
        setPartnerships({ eventPartnerships: [], placePartnerships: [] });
        showError(errorMessage);
      }
    };

    if (userId) {
      withLoading(fetchPartnerships);
    }
  }, [userId]);

  return { partnerships, isLoading };
};
