import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import useHandleApiErrors from "./useHandleApiErrors";

const useSubmitProduct = () => {
  const { isLoading, withLoading } = useLoading();
  const { handleApiError } = useHandleApiErrors();

  const createProduct = async (data: { productCategory: string }) => {
    try {
      const response = await withLoading(() =>
        apiClient.post("/api/products", data, {
          headers: { "Content-Type": "application/json" },
        }),
      );
      return response.data?.data ?? true;
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await withLoading(() => apiClient.delete(`/api/products/${productId}`));
      return true;
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  return { createProduct, deleteProduct, isLoading };
};

export default useSubmitProduct;
