import { useState, useEffect, useCallback } from "react";
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
  options?: UsePartnershipsSentOptions,
) => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const { t } = useTranslation("account");

  const status = options?.status;

  const fetchPartnerships = useCallback(async () => {
    if (!userId) {
      return;
    }
    try {
      const params = new URLSearchParams({ asInitiator: "true" });
      if (status) {
        params.append("status", status);
      }
      const response = await apiClient.get(
        `/api/partnerships/user/${userId}?${params.toString()}`,
      );
      const data = response.data?.data ?? [];
      setPartnerships(Array.isArray(data) ? data : []);
    } catch (err) {
      setPartnerships([]);
      showError(
        getErrorMessage(err, t, t("usePartnershipsSent.loadError")),
      );
    }
  }, [userId, status, t, showError]);

  useEffect(() => {
    if (!userId) return;
    void withLoading(fetchPartnerships);
  }, [userId, fetchPartnerships, withLoading]);

  return {
    partnerships: userId ? partnerships : [],
    isLoading,
    refetch: fetchPartnerships,
  };
};
