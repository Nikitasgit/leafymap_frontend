import { apiClient } from "@/lib/api/client";
import { useLoading } from "./useLoading";
import useHandleApiErrors from "./useHandleApiErrors";

const useSubmitImages = () => {
  const { isLoading, withLoading } = useLoading();
  const { handleApiError } = useHandleApiErrors();

  interface SubmitImagesParams {
    files: File[];
    reference: string;
    referenceType: string;
    type: string;
  }

  interface UploadImagesResponse {
    images: Array<{
      id: string;
      urls: {
        original: string;
        thumbnail: string;
        medium: string;
      };
      signedUrls: {
        original: string;
        thumbnail: string;
        medium: string;
      };
      referenceType: string;
      reference: string;
      type: string;
      originalName: string;
      size: number;
      mimetype: string;
      createdAt: string;
      updatedAt: string;
    }>;
    count: number;
  }

  const submitImages = async (
    params: SubmitImagesParams,
  ): Promise<UploadImagesResponse | undefined> => {
    try {
      const formData = new FormData();
      params.files.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("reference", params.reference);
      formData.append("referenceType", params.referenceType);
      formData.append("type", params.type);

      const response = await withLoading(() =>
        apiClient.post("/api/images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      );

      return response.data.data;
    } catch (err: unknown) {
      handleApiError(err);
    }
  };

  return { submitImages, isLoading };
};

export default useSubmitImages;
