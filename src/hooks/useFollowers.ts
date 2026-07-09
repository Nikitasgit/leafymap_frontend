import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { FollowUser } from "@/types/follow";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

const useFollowers = (userId?: string) => {
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const { isLoading, withLoading } = useLoading(!!userId);
  const { showError } = useToast();
  const { t } = useTranslation("account");

  const fetchFollowers = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await apiClient.get(
        `/api/follows/followers/${userId}`,
        {
        }
      );
      setFollowers(response.data.data.followers || []);
    } catch (err: unknown) {
      setFollowers([]);
      showError(
        getErrorMessage(err, t, t("useFollowers.loadErrorFallback")),
      );
    }
  }, [userId, showError, t]);

  useEffect(() => {
    if (!userId) {
      setFollowers([]);
      return;
    }
    withLoading(fetchFollowers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const refetch = useCallback(() => {
    if (userId) {
      fetchFollowers();
    }
  }, [userId, fetchFollowers]);

  return { followers, isLoading, refetch };
};

export default useFollowers;
