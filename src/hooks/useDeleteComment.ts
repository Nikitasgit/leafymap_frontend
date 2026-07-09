import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";
import { useTranslation } from "react-i18next";

const useDeleteComment = () => {
  const { isLoading, withLoading } = useLoading();
  const { showSuccess } = useToast();
  const { handleApiError } = useHandleApiErrors();
  const { t } = useTranslation("reviews");

  const deleteComment = async (commentId: string) => {
    try {
      await withLoading(() =>
        apiClient.delete(
          `/api/comments/${commentId}`,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      );
      showSuccess(t("useDeleteComment.success"));
      return true;
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  return { deleteComment, isLoading };
};

export default useDeleteComment;
