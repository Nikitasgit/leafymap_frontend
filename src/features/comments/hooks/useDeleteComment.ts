import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { deleteComment as deleteCommentApi } from "../api/commentsApi";

const useDeleteComment = () => {
  const { t } = useTranslation("reviews");
  const { mutate, isLoading } = useApiMutation(
    async (commentId: string) => {
      await deleteCommentApi(commentId);
      return true as const;
    },
    { successMessage: t("useDeleteComment.success") },
  );

  return { deleteComment: mutate, isLoading };
};

export default useDeleteComment;
