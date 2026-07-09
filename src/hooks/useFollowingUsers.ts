import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { FollowUser } from "@/types/follow";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

const useFollowingUsers = (userId?: string) => {
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const { isLoading, withLoading } = useLoading(!!userId);
  const { showError } = useToast();
  const { t } = useTranslation("account");

  const fetchFollowing = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await apiClient.get(
        `/api/follows/following/${userId}`,
        {
        }
      );
      setFollowing(response.data.data.following || []);
    } catch (err: unknown) {
      setFollowing([]);
      showError(
        getErrorMessage(err, t, t("useFollowingUsers.loadErrorFallback")),
      );
    }
  }, [userId, showError, t]);

  useEffect(() => {
    if (!userId) {
      setFollowing([]);
      return;
    }
    withLoading(fetchFollowing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const refetch = useCallback(() => {
    if (userId) {
      fetchFollowing();
    }
  }, [userId, fetchFollowing]);

  return { following, isLoading, refetch };
};

export default useFollowingUsers;
