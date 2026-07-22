import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchUserPartnerships } from "../api/partnershipsApi";
import type { Partnership } from "../types";

export interface UsePartnershipsSentOptions {
  status?: Partnership["status"];
}

export const usePartnershipsSent = (
  userId?: string,
  options?: UsePartnershipsSentOptions,
) => {
  const { t } = useTranslation("account");
  const status = options?.status;

  const {
    data: partnerships,
    isLoading,
    refetch,
  } = useApiQuery<Partnership[]>(
    () =>
      fetchUserPartnerships(userId as string, { asInitiator: true, status }),
    {
      initialData: [],
      enabled: !!userId,
      deps: [userId, status],
      errorMessage: t("usePartnershipsSent.loadError"),
    },
  );

  return { partnerships, isLoading, refetch };
};
