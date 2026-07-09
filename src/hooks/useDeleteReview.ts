import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

const useDeleteReview = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();
  const { t } = useTranslation("reviews");

  const deleteReview = async (reviewId: string) => {
    try {
      await withLoading(() =>
        apiClient.delete(
          `/api/reviews/${reviewId}`,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      );
      showSuccess(t("useDeleteReview.success"));
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, t, t("useDeleteReview.deleteError")));
      throw err;
    }
  };

  return { deleteReview, isLoading };
};

export default useDeleteReview;
