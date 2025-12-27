import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { CommentReferenceType } from "@/types/comment";

interface SubmitCommentData {
  content: string;
  reference: string;
  referenceType: CommentReferenceType;
}

const useSubmitComment = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const submitComment = async (data: SubmitCommentData) => {
    try {
      // If commenting on a Review, use the specific review comment endpoint
      if (data.referenceType === "Review") {
        await withLoading(() =>
          axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/comments/review`,
            {
              content: data.content,
              reference: data.reference,
              referenceType: data.referenceType,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          )
        );
      } else {
        // For other reference types, use the generic endpoint
        await withLoading(() =>
          axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, data, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          })
        );
      }
      showSuccess("Commentaire publié avec succès");
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        if (err.response.data.data) {
          Object.values(err.response.data.data).forEach((error: unknown) => {
            if (Array.isArray(error)) {
              error.forEach((e: string) => {
                showError(e);
              });
            } else if (typeof error === "string") {
              showError(error);
            }
          });
        } else {
          showError(err.response.data.message);
        }
      } else {
        showError("Une erreur inattendue s'est produite");
      }
      throw err;
    }
  };

  return { submitComment, isLoading };
};

export default useSubmitComment;
