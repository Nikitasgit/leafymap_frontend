import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

const useDeleteComment = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const deleteComment = async (commentId: string) => {
    try {
      await withLoading(() =>
        axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      );
      showSuccess("Commentaire supprimé avec succès");
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

  return { deleteComment, isLoading };
};

export default useDeleteComment;
