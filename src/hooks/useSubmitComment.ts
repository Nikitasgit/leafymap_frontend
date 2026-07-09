import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";
import { useTranslation } from "react-i18next";
import { CommentReferenceType } from "@/types/comment";

interface SubmitCommentData {
  content: string;
  reference: string;
  referenceType: CommentReferenceType;
}

const useSubmitComment = () => {
  const { isLoading, withLoading } = useLoading();
  const { showSuccess } = useToast();
  const { handleApiError } = useHandleApiErrors();
  const { t } = useTranslation("reviews");

  const submitComment = async (data: SubmitCommentData) => {
    try {
      // Use the generic endpoint for all comment types (including Review)
        await withLoading(() =>
          apiClient.post(`/api/comments`, data, {
            headers: {
              "Content-Type": "application/json",
            }
          })
        );
      showSuccess(t("useSubmitComment.success"));
      return true;
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  return { submitComment, isLoading };
};

export default useSubmitComment;
