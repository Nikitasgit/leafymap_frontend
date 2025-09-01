import axios, { AxiosError } from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

const useSubmitImages = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();

  interface SubmitImagesParams {
    files: File[];
    reference: string;
    referenceType: string;
    type: string;
  }

  interface UploadImagesResponse {
    images: Array<{
      _id: string;
      url: string;
      signedUrl: string;
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
    params: SubmitImagesParams
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
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/images`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
      );

      return response.data.data;
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof AxiosError && err.response?.data.message) {
        showError(err.response.data.message);
      } else {
        showError(
          "Une erreur inattendue s'est produite lors de l'upload des images"
        );
      }
    }
  };

  return { submitImages, isLoading };
};

export default useSubmitImages;
