import {
  submitImages as submitImagesRequest,
  type SubmitImagesParams,
  type UploadImagesResponse,
} from "@/shared/api/imagesApi";
import { useLoading } from "./useLoading";
import useHandleApiErrors from "./useHandleApiErrors";

const useSubmitImages = () => {
  const { isLoading, withLoading } = useLoading();
  const { handleApiError } = useHandleApiErrors();

  const submitImages = async (
    params: SubmitImagesParams,
  ): Promise<UploadImagesResponse | undefined> => {
    try {
      return await withLoading(() => submitImagesRequest(params));
    } catch (err: unknown) {
      handleApiError(err);
    }
  };

  return { submitImages, isLoading };
};

export default useSubmitImages;
