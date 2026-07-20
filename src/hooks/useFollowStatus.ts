import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";

interface UseFollowStatusParams {
  currentUserId: string | undefined;
  targetUserId: string;
}

interface FollowData {
  id: string;
}

const useFollowStatus = ({
  currentUserId,
  targetUserId,
}: UseFollowStatusParams) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followId, setFollowId] = useState<string | null>(null);

  const checkFollowStatus = useCallback(async () => {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
      setIsFollowing(false);
      setFollowId(null);
      return;
    }
    try {
      const response = await apiClient.get(`/api/follows/check`, {
        params: {
          follower: currentUserId,
          following: targetUserId,
        },
      });
      const followData = response.data.data?.follow as FollowData | undefined;
      setIsFollowing(!!followData);
      setFollowId(followData?.id ?? null);
    } catch {
      setIsFollowing(false);
      setFollowId(null);
    }
  }, [currentUserId, targetUserId]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
        if (!cancelled) {
          setIsFollowing(false);
          setFollowId(null);
        }
        return;
      }
      try {
        const response = await apiClient.get(`/api/follows/check`, {
          params: {
            follower: currentUserId,
            following: targetUserId,
          },
        });
        if (cancelled) return;
        const followData = response.data.data?.follow as FollowData | undefined;
        setIsFollowing(!!followData);
        setFollowId(followData?.id ?? null);
      } catch {
        if (!cancelled) {
          setIsFollowing(false);
          setFollowId(null);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [currentUserId, targetUserId]);

  return {
    isFollowing,
    followId,
    setIsFollowing,
    setFollowId,
    refetch: checkFollowStatus,
  };
};

export default useFollowStatus;
