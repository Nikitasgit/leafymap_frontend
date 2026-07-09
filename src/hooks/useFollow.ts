import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";
import { useTranslation } from "react-i18next";

const useFollow = () => {
  const { isLoading, withLoading } = useLoading();
  const { showSuccess } = useToast();
  const { handleApiError } = useHandleApiErrors();
  const { t } = useTranslation("account");

  const follow = async (followingId: string) => {
    try {
      const response = await withLoading(() =>
        apiClient.post(
          `/api/follows`,
          { followingId },
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      );
      showSuccess(t("useFollow.followSuccess"));
      return response.data.data;
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
      throw err;
    }
  };

  const unfollow = async (followId: string) => {
    try {
      await withLoading(() =>
        apiClient.delete(
          `/api/follows/${followId}`,
          {
          }
        )
      );
      showSuccess(t("useFollow.unfollowSuccess"));
      return true;
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
      throw err;
    }
  };

  return { follow, unfollow, isLoading };
};

export default useFollow;
