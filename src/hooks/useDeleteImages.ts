import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

const useDeleteImages = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();

  interface DeleteImagesResponse {
    deletedFromDB: number;
    deletedFromS3: number;
    failedS3Deletions: number;
    s3DeleteResults: Array<
      | {
          imageId: string;
          url: string;
          deletedFromS3: boolean;
        }
      | {
          error: string;
        }
    >;
  }

  const deleteImages = async (
    images: string[]
  ): Promise<DeleteImagesResponse | undefined> => {
    try {
      const response = await withLoading(() =>
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/images`, {
          data: {
            images,
          },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
      );
      return response.data.data;
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
        showError(
          "Une erreur inattendue s'est produite lors de la suppression des images"
        );
      }
    }
  };

  return { deleteImages, isLoading };
};

export default useDeleteImages;
