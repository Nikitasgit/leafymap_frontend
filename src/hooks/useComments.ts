import { useState, useEffect } from "react";
import { CommentPopulated } from "@/types/comment";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import axios from "axios";

interface UseCommentsParams {
  reference?: string;
  referenceType?: "Review" | "Image" | "Comment";
  author?: string;
}

export const useComments = (params?: UseCommentsParams) => {
  const [comments, setComments] = useState<CommentPopulated[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  const fetchComments = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.reference) queryParams.append("reference", params.reference);
      if (params?.referenceType)
        queryParams.append("referenceType", params.referenceType);
      if (params?.author) queryParams.append("author", params.author);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/comments${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await axios.get(url);
      setComments(response.data.data.comments || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des commentaires";
      showError(errorMessage);
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
