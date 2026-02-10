import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { FollowUser } from "@/types/follow";

const useFollowingUsers = (userId?: string) => {
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const { isLoading, withLoading } = useLoading(!!userId);
  const { showError } = useToast();

  const fetchFollowing = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/follows/following/${userId}`,
        {
          withCredentials: true,
        }
      );
      setFollowing(response.data.data.following || []);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des abonnements";
      setFollowing([]);
      showError(errorMessage);
    }
  }, [userId, showError]);

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
