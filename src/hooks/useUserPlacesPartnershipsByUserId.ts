import { useState, useEffect } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { PartnershipPopulated } from "@/types/partnerships";

export const useUserPlacesPartnershipsByUserId = (
  userId?: string,
  queryParams: Record<string, string> = {}
) => {
  const [partnerships, setPartnerships] = useState<PartnershipPopulated[]>([]);
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
      }/api/partnerships/user/${userId}/places?${searchParams.toString()}`;

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
          : "Erreur lors du chargement des partenariats de lieu";
      setPartnerships([]);
      showError(errorMessage);
    }
  };

  useEffect(() => {
    if (userId) {
      withLoading(fetchPartnerships);
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { partnerships, isLoading, refetch: fetchPartnerships };
};
