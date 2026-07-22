import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import {
  createComment,
  type CreateCommentData,
} from "../api/commentsApi";

const useSubmitComment = () => {
  const { t } = useTranslation("reviews");
  const { mutate, isLoading } = useApiMutation(
    async (data: CreateCommentData) => {
      await createComment(data);
      return true as const;
    },
    { successMessage: t("useSubmitComment.success") },
  );

  return { submitComment: mutate, isLoading };
};

export default useSubmitComment;
