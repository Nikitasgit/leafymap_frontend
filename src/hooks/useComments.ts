import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { CommentPopulated } from "@/types/comment";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

interface UseCommentsParams {
  reference?: string;
  referenceType?: "Review" | "Image" | "Comment";
  author?: string;
}

export const useComments = (params?: UseCommentsParams) => {
  const [comments, setComments] = useState<CommentPopulated[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const { t } = useTranslation("reviews");

  const fetchComments = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.reference) queryParams.append("reference", params.reference);
      if (params?.referenceType)
        queryParams.append("referenceType", params.referenceType);
      if (params?.author) queryParams.append("author", params.author);

      const url = `/api/comments${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await apiClient.get(url);
      setComments(response.data.data.comments || []);
    } catch (err) {
      showError(getErrorMessage(err, t, t("useComments.loadError")));
      setComments([]);
    }
  };

  useEffect(() => {
    if (params?.reference && params?.referenceType) {
      withLoading(fetchComments);
    }
  }, [params?.reference, params?.referenceType, params?.author]); // eslint-disable-line react-hooks/exhaustive-deps

  return { comments, isLoading, refetch: fetchComments };
};
