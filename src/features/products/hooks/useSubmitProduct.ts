import { useLoading } from "@/shared/hooks/useLoading";
import useHandleApiErrors from "@/shared/hooks/useHandleApiErrors";
import {
  createProduct as createProductApi,
  deleteProduct as deleteProductApi,
} from "../api/productsApi";

const useSubmitProduct = () => {
  const { isLoading, withLoading } = useLoading();
  const { handleApiError } = useHandleApiErrors();

  const createProduct = async (data: { productCategory: string }) => {
    try {
      return await withLoading(() => createProductApi(data));
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await withLoading(() => deleteProductApi(productId));
      return true;
    } catch (err: unknown) {
      handleApiError(err, undefined, true);
    }
  };

  return { createProduct, deleteProduct, isLoading };
};

export default useSubmitProduct;
