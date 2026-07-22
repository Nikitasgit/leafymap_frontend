import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchComments, type FetchCommentsParams } from "../api/commentsApi";
import type { CommentPopulated } from "../types";

export type UseCommentsParams = FetchCommentsParams;

export const useComments = (params?: UseCommentsParams) => {
  const { t } = useTranslation("reviews");
  const enabled = Boolean(params?.reference && params?.referenceType);

  const { data: comments, isLoading, refetch } = useApiQuery<CommentPopulated[]>(
    () => fetchComments(params),
    {
      initialData: [],
      enabled,
      deps: [params?.reference, params?.referenceType, params?.author],
      errorMessage: t("useComments.loadError"),
    },
  );

  return { comments, isLoading, refetch };
};
