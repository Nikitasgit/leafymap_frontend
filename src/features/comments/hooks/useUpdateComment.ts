import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import {
  updateComment as updateCommentApi,
  type UpdateCommentData,
} from "../api/commentsApi";

const useUpdateComment = () => {
  const { t } = useTranslation("reviews");
  const { mutate, isLoading } = useApiMutation(
    async (commentId: string, data: UpdateCommentData) => {
      await updateCommentApi(commentId, data);
      return true as const;
    },
    { successMessage: t("useUpdateComment.success") },
  );

  return { updateComment: mutate, isLoading };
};

export default useUpdateComment;
