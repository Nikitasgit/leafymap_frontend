import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { FollowUser } from "@/types/follow";

const useFollowers = (userId?: string) => {
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const { isLoading, withLoading } = useLoading(!!userId);
  const { showError } = useToast();

  const fetchFollowers = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/follows/followers/${userId}`,
        {
          withCredentials: true,
        }
      );
      setFollowers(response.data.data.followers || []);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des abonnés";
      setFollowers([]);
      showError(errorMessage);
    }
  }, [userId, showError]);

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
