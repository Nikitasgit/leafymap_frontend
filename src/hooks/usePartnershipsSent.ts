import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Partnership } from "@/types/partnerships";

export interface UsePartnershipsSentOptions {
  status?: Partnership["status"];
}

export const usePartnershipsSent = (
  userId?: string,
  options?: UsePartnershipsSentOptions
) => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const showErrorRef = useRef(showError);
  showErrorRef.current = showError;

  const fetchPartnerships = useCallback(async () => {
    if (!userId) {
      setPartnerships([]);
      return;
    }
    try {
      const params = new URLSearchParams({ asInitiator: "true" });
      if (options?.status) {
        params.append("status", options.status);
      }
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/partnerships/user/${userId}?${params.toString()}`,
        { withCredentials: true }
      );
      const data = response.data?.data ?? [];
      setPartnerships(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des invitations";
      setPartnerships([]);
      showErrorRef.current(message);
    }
  }, [userId, options?.status]);

  useEffect(() => {
    if (userId) {
      withLoading(fetchPartnerships);
    } else {
      setPartnerships([]);
    }
  }, [userId, fetchPartnerships]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    partnerships,
    isLoading,
    refetch: fetchPartnerships,
  };
};
