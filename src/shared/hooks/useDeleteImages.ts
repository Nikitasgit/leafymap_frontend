import { useLoading } from "./useLoading";
import { deleteImages as deleteImagesRequest } from "@/shared/api/imagesApi";
import useHandleApiErrors from "./useHandleApiErrors";

const useDeleteImages = () => {
  const { isLoading, withLoading } = useLoading();
  const { handleApiError } = useHandleApiErrors();

  const deleteImages = async (images: string[]): Promise<void> => {
    try {
      await withLoading(() => deleteImagesRequest(images));
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
