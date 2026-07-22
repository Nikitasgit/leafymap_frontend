import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import type { FollowUser } from "../types";
import { fetchFollowing } from "../api/followsApi";

const useFollowingUsers = (userId?: string) => {
  const { t } = useTranslation("account");

  const {
    data: following,
    isLoading,
    refetch,
  } = useApiQuery<FollowUser[]>(() => fetchFollowing(userId as string), {
    initialData: [],
    enabled: !!userId,
    deps: [userId],
    errorMessage: t("useFollowingUsers.loadErrorFallback"),
  });

  return { following, isLoading, refetch };
};

export default useFollowingUsers;
