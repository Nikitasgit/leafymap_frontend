import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface UseFollowStatusParams {
  currentUserId: string | undefined;
  targetUserId: string;
}

interface FollowData {
  _id: string;
}

const useFollowStatus = ({ currentUserId, targetUserId }: UseFollowStatusParams) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followId, setFollowId] = useState<string | null>(null);

  const checkFollowStatus = useCallback(async () => {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
      setIsFollowing(false);
      setFollowId(null);
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/follows/check`,
        {
          params: {
            follower: currentUserId,
            following: targetUserId,
          },
          withCredentials: true,
        }
      );
      const followData = response.data.data?.follow as FollowData | undefined;
      setIsFollowing(!!followData);
      setFollowId(followData?._id ?? null);
    } catch {
      setIsFollowing(false);
      setFollowId(null);
    }
  }, [currentUserId, targetUserId]);

  useEffect(() => {
    checkFollowStatus();
  }, [checkFollowStatus]);

  return { isFollowing, followId, setIsFollowing, setFollowId, refetch: checkFollowStatus };
};

export default useFollowStatus;
