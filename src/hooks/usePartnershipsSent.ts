import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api/client";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Partnership } from "@/types/partnerships";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

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
  const { t } = useTranslation("account");
  const showErrorRef = useRef(showError);
  showErrorRef.current = showError;
  const tRef = useRef(t);
  tRef.current = t;

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
      const response = await apiClient.get(
        `/api/partnerships/user/${userId}?${params.toString()}`,
      );
      const data = response.data?.data ?? [];
      setPartnerships(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = getErrorMessage(
        err,
        tRef.current,
        tRef.current("usePartnershipsSent.loadError"),
      );
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
