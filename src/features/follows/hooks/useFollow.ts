import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { createFollow, deleteFollow, type FollowRecord } from "../api/followsApi";

const useFollow = () => {
  const { t } = useTranslation("account");

  const { mutate: follow, isLoading: isFollowMutating } = useApiMutation(
    async (followingId: string): Promise<FollowRecord> => createFollow(followingId),
    { successMessage: t("useFollow.followSuccess"), rethrow: true },
  );

  const { mutate: unfollow, isLoading: isUnfollowMutating } = useApiMutation(
    async (followId: string) => {
      await deleteFollow(followId);
      return true as const;
    },
    { successMessage: t("useFollow.unfollowSuccess"), rethrow: true },
  );

  return {
    follow,
    unfollow,
    isLoading: isFollowMutating || isUnfollowMutating,
  };
};

export default useFollow;
