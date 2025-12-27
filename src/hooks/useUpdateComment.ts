import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

interface UpdateCommentData {
  content: string;
}

const useUpdateComment = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const updateComment = async (commentId: string, data: UpdateCommentData) => {
    try {
      await withLoading(() =>
        axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      );
      showSuccess("Commentaire modifié avec succès");
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

  return { updateComment, isLoading };
};

export default useUpdateComment;
