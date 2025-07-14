import { useState } from "react";
import axios from "axios";
import { useToast } from "./useToast";
import { useLoading } from "./useLoading";

export type EntityType = "user" | "place" | "event";

interface UpdateProfilePictureParams {
  entityType: EntityType;
  entityId?: string; // Required for place and event, optional for user (uses current user)
  file: File;
}

interface UseUpdateProfilePictureReturn {
  updateProfilePicture: (
    params: UpdateProfilePictureParams
  ) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

const useUpdateProfilePicture = (): UseUpdateProfilePictureReturn => {
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();
  const { isLoading, withLoading } = useLoading();

  const updateProfilePicture = async (
    params: UpdateProfilePictureParams
  ): Promise<string | null> => {
    return withLoading(async () => {
      try {
        setError(null);
        const { entityType, entityId, file } = params;

        // Validate file
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(
            "Type de fichier invalide. Seuls JPEG, PNG, GIF et WebP sont autorisés."
          );
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new Error("La taille du fichier doit être inférieure à 5MB.");
        }

        // Validate entityId for place and event
        if (entityType !== "user" && !entityId) {
          throw new Error(`${entityType} ID is required`);
        }

        // Create FormData
        const formData = new FormData();
        formData.append("image", file);
        formData.append("entityType", entityType);

        if (entityId) {
          formData.append("entityId", entityId);
        }

        const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/images/profile-picture`;

        const response = await axios.post(endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        const { imageUrl } = response.data.data;

        showSuccess("Photo de profil mise à jour avec succès !");
        return imageUrl;
      } catch (err: unknown) {
        console.error("Error updating profile picture:", err);

        let errorMessage =
          "Erreur lors de la mise à jour de la photo de profil";

        if (axios.isAxiosError(err) && err.response) {
          const responseData = err.response.data;
          errorMessage =
            responseData.error || responseData.message || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        showError(errorMessage);
        return null;
      }
    });
  };

  return { updateProfilePicture, isLoading, error };
};

export default useUpdateProfilePicture;
