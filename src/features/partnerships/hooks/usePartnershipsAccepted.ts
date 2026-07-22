import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchUserPartnerships } from "../api/partnershipsApi";
import type { Partnership } from "../types";

export const usePartnershipsAccepted = (userId?: string) => {
  const { t } = useTranslation("account");

  const {
    data: partnerships,
    isLoading,
    refetch,
  } = useApiQuery<Partnership[]>(
    () => fetchUserPartnerships(userId as string, { status: "accepted" }),
    {
      initialData: [],
      enabled: !!userId,
      deps: [userId],
      errorMessage: t("usePartnershipsAccepted.loadError"),
    },
  );

  return { partnerships, isLoading, refetch };
};
