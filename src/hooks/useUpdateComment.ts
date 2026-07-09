import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";
import { useTranslation } from "react-i18next";

interface UpdateCommentData {
  content: string;
}

const useUpdateComment = () => {
  const { isLoading, withLoading } = useLoading();
  const { showSuccess } = useToast();
  const { handleApiError } = useHandleApiErrors();
  const { t } = useTranslation("reviews");

  const updateComment = async (commentId: string, data: UpdateCommentData) => {
    try {
      await withLoading(() =>
        apiClient.put(
          `/api/comments/${commentId}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      );
      showSuccess(t("useUpdateComment.success"));
      return true;
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  return { updateComment, isLoading };
};

export default useUpdateComment;
