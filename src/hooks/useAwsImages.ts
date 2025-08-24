import axios from "axios";
import { useToast } from "./useToast";
import { useLoading } from "./useLoading";

interface UploadImagesParams {
  files: File[];
}

interface DeleteImagesParams {
  imageUrls: string[];
}

interface UploadedImage {
  originalName: string;
  url: string;
  signedUrl: string;
  size: number;
  mimetype: string;
}

interface UploadResponse {
  images: UploadedImage[];
  count: number;
}

interface DeleteResponse {
  results: Array<{
    status: "fulfilled" | "rejected";
    value?: {
      url: string;
      deleted: boolean;
    };
    reason?: unknown;
  }>;
  totalRequested: number;
}

const useAwsImages = () => {
  const { showSuccess, showError } = useToast();
  const { isLoading, withLoading } = useLoading();

  const uploadImages = async (
    params: UploadImagesParams
  ): Promise<UploadedImage[] | null> => {
    return withLoading(async () => {
      try {
        const { files } = params;

        if (!files || files.length === 0) {
          throw new Error("Aucun fichier fourni");
        }

        if (files.length > 10) {
          throw new Error("Maximum 10 images autorisées");
        }

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];

        const maxSize = 5 * 1024 * 1024; // 5MB
        for (const file of files) {
          if (!allowedTypes.includes(file.type)) {
            throw new Error(
              `Type de fichier invalide: ${file.name}. Seuls JPEG, PNG, GIF et WebP sont autorisés.`
            );
          }

          if (file.size > maxSize) {
            throw new Error(
              `Fichier trop volumineux: ${file.name}. La taille maximale est de 5MB.`
            );
          }
        }

        const formData = new FormData();
        files.forEach((file) => {
          formData.append("images", file);
        });

        const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/aws/images/upload`;

        const response = await axios.post<{ data: UploadResponse }>(
          endpoint,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        const { images } = response.data.data;

        showSuccess(`${images.length} image(s) téléchargée(s) avec succès !`);
        return images;
      } catch (err: unknown) {
        console.error("Error uploading images:", err);

        let errorMessage = "Erreur lors du téléchargement des images";

        if (axios.isAxiosError(err) && err.response) {
          const responseData = err.response.data;
          errorMessage =
            responseData.error || responseData.message || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        showError(errorMessage);
        return null;
      }
    });
  };

  const deleteImages = async (params: DeleteImagesParams): Promise<boolean> => {
    return withLoading(async () => {
      try {
        const { imageUrls } = params;

        if (!imageUrls || imageUrls.length === 0) {
          throw new Error("Aucune URL d'image fournie");
        }

        const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/aws/images/delete`;

        const response = await axios.delete<{ data: DeleteResponse }>(
          endpoint,
          {
            data: { imageUrls },
            withCredentials: true,
          }
        );

        const { results, totalRequested } = response.data.data;

        const successfulDeletions = results.filter(
          (result) => result.status === "fulfilled" && result.value?.deleted
        ).length;

        const failedDeletions = totalRequested - successfulDeletions;

        if (failedDeletions === 0) {
          showSuccess(
            `${successfulDeletions} image(s) supprimée(s) avec succès !`
          );
        } else {
          showSuccess(
            `${successfulDeletions} image(s) supprimée(s), ${failedDeletions} échec(s)`
          );
        }

        return successfulDeletions > 0;
      } catch (err: unknown) {
        console.error("Error deleting images:", err);

        let errorMessage = "Erreur lors de la suppression des images";

        if (axios.isAxiosError(err) && err.response) {
          const responseData = err.response.data;
          errorMessage =
            responseData.error || responseData.message || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        showError(errorMessage);
        return false;
      }
    });
  };

  return { uploadImages, deleteImages, isLoading };
};

export default useAwsImages;
