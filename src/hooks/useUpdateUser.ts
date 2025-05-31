import { useState } from "react";
import axios from "axios";
import type { FormData } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { fetchUser } from "@/store/userSlice";
import { useAppDispatch } from "@/store";
import { useRouter } from "next/navigation";

type UseCreateProfileReturn = {
  submitForm: (data: FormData, isUpdate: boolean) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

const useSubmitForm = (): UseCreateProfileReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const submitForm = async (
    data: FormData,
    isUpdate: boolean
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const form = new FormData();
      form.append("userType", data.userType);
      form.append("name", data.name);
      form.append("description", data.description);
      form.append("category", data.category);
      form.append("phone", data.phone);
      form.append("email", data.email);
      form.append("website", data.website);
      if (data.placeCategory) {
        form.append("placeCategory", data.placeCategory);
      }
      if (data.location) {
        form.append("location", JSON.stringify(data.location));
      }
      if (data.defaultSchedule) {
        form.append("defaultSchedule", JSON.stringify(data.defaultSchedule));
      }
      if (data.collaborators) {
        const collaboratorIds = data.collaborators.map((collab) => collab.id);
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
      if (data.image instanceof File) {
        form.append("image", data.image);
      }

      if (isUpdate) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/update-creator`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      } else {
        const url =
          data.userType === "creator"
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/create-creator`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/users/create-organizer`;

        await axios.post(url, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      }

      router.push("/account");
      setSuccess(true);
      dispatch(fetchUser());
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la soumission du profil"
      );
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, error, success };
};

export default useSubmitForm;
