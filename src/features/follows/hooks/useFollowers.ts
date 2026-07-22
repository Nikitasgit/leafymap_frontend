import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import type { FollowUser } from "../types";
import { fetchFollowers } from "../api/followsApi";

const useFollowers = (userId?: string) => {
  const { t } = useTranslation("account");

  const {
    data: followers,
    isLoading,
    refetch,
  } = useApiQuery<FollowUser[]>(() => fetchFollowers(userId as string), {
    initialData: [],
    enabled: !!userId,
    deps: [userId],
    errorMessage: t("useFollowers.loadErrorFallback"),
  });

  return { followers, isLoading, refetch };
};

export default useFollowers;
