import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchUserPartnerships } from "../api/partnershipsApi";
import type { Partnership } from "../types";

export interface UsePartnershipsReceivedOptions {
  status?: Partnership["status"];
}

export const usePartnershipsReceived = (
  userId?: string,
  options?: UsePartnershipsReceivedOptions,
) => {
  const { t } = useTranslation("account");
  const status = options?.status;

  const {
    data: partnerships,
    isLoading,
    refetch,
  } = useApiQuery<Partnership[]>(
    () =>
      fetchUserPartnerships(userId as string, {
        asCollaborator: true,
        status,
      }),
    {
      initialData: [],
      enabled: !!userId,
      deps: [userId, status],
      errorMessage: t("usePartnershipsReceived.loadError"),
    },
  );

  return { partnerships, isLoading, refetch };
};
