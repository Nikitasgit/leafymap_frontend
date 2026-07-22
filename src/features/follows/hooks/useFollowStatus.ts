import { useCallback } from "react";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { checkFollowStatus } from "../api/followsApi";

interface UseFollowStatusParams {
  currentUserId: string | undefined;
  targetUserId: string;
}

type FollowStatusData = {
  isFollowing: boolean;
  followId: string | null;
};

const initialFollowStatus: FollowStatusData = {
  isFollowing: false,
  followId: null,
};

const useFollowStatus = ({
  currentUserId,
  targetUserId,
}: UseFollowStatusParams) => {
  const enabled = Boolean(
    currentUserId && targetUserId && currentUserId !== targetUserId,
  );

  const { data, refetch, setData } = useApiQuery<FollowStatusData>(
    async () => {
      try {
        const followData = await checkFollowStatus(
          currentUserId as string,
          targetUserId,
        );
        return { isFollowing: !!followData, followId: followData?.id ?? null };
      } catch {
        return initialFollowStatus;
      }
    },
    {
      initialData: initialFollowStatus,
      enabled,
      deps: [currentUserId, targetUserId],
      errorMessage: "",
    },
  );

  const setIsFollowing = useCallback(
    (isFollowing: boolean) =>
      setData((prev) => ({ ...prev, isFollowing })),
    [setData],
  );

  const setFollowId = useCallback(
    (followId: string | null) => setData((prev) => ({ ...prev, followId })),
    [setData],
  );

  return {
    isFollowing: data.isFollowing,
    followId: data.followId,
    setIsFollowing,
    setFollowId,
    refetch,
  };
};

export default useFollowStatus;
