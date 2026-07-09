import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import useHandleApiErrors from "./useHandleApiErrors";

const useDeleteImages = () => {
  const { isLoading, withLoading } = useLoading();
  const { handleApiError } = useHandleApiErrors();

  const deleteImages = async (images: string[]): Promise<void> => {
    try {
      await withLoading(() =>
        apiClient.delete("/api/images", {
          data: {
            images,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );
    } catch (err: unknown) {
      handleApiError(
        err,
        undefined,
        true,
      );
    }
  };

  return { deleteImages, isLoading };
};

export default useDeleteImages;
