import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

const useSubmitProduct = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();

  const createProduct = async (data: { productCategory: string }) => {
    try {
      const response = await withLoading(() =>
        axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
          data,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
      );
      return response.data?.data ?? true;
    } catch (err: unknown) {
      handleApiError(err);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await withLoading(() =>
        axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
          { withCredentials: true }
        )
      );
      return true;
    } catch (err: unknown) {
      handleApiError(err);
    }
  };

  function handleApiError(err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data) {
      if (err.response.data.data) {
        const responseData = err.response.data.data;
        if (typeof responseData === "object") {
          Object.values(responseData).forEach((error: unknown) => {
            if (Array.isArray(error)) {
              error.forEach((e: string) => showError(e));
            } else if (typeof error === "string") {
              showError(error);
            }
          });
        }
      } else {
        showError(err.response.data.message ?? "Erreur");
      }
    } else {
      showError("Une erreur inattendue s'est produite");
    }
  }

  return { createProduct, deleteProduct, isLoading };
};

export default useSubmitProduct;
