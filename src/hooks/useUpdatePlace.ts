import { useState } from "react";
import axios from "axios";
import { fetchUser } from "@/store/userSlice";
import { useAppDispatch } from "@/store";
import { useRouter, useParams } from "next/navigation";
import { PlaceFormData } from "@/components/account/createProfileStepper/CreateProfileStepper.types";

type UseUpdatePlaceReturn = {
  submitForm: (data: PlaceFormData, isUpdate: boolean) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

const useUpdatePlace = (): UseUpdatePlaceReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const placeId = params.placeId as string;

  const submitForm = async (data: PlaceFormData, isUpdate: boolean) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isUpdate && !placeId) {
        throw new Error("Place ID is required for update");
      }
      const form = new FormData();
      form.append("name", data.name);
      form.append("description", data.description);
      form.append("placeCategory", data.placeCategory);
      form.append("phone", data.phone);
      form.append("email", data.email);
      form.append("website", data.website);
      form.append("location", JSON.stringify(data.location));
      form.append("defaultSchedule", JSON.stringify(data.defaultSchedule));

      if (data.collaborators) {
        const collaboratorIds = data.collaborators.map((collab) => collab._id);
        form.append("collaborators", JSON.stringify(collaboratorIds));
      }
      if (data.createdCollaborators) {
        const cleanedCollaborators = data.createdCollaborators.map(
          (collaborator) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...collaboratorWithoutId } = collaborator;
            return collaboratorWithoutId;
          }
        );
        form.append(
          "createdCollaborators",
          JSON.stringify(cleanedCollaborators)
        );
      }
      if (data.image) {
        form.append("image", data.image);
      }

      if (isUpdate) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/places`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      }

      router.push("/account");
      setSuccess(true);
      dispatch(fetchUser());
    } catch (err: unknown) {
      console.error("Error in submitForm:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la soumission du lieu"
      );
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, error, success };
};

export default useUpdatePlace;
