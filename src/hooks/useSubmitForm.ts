import { useState } from "react";
import axios from "axios";
import type { FormData } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { fetchUser } from "@/store/userSlice";
import { useAppDispatch } from "@/store";
import { useRouter } from "next/navigation";

type UseSubmitFormParams = {
  isUpdate?: boolean;
};

type UseCreateProfileReturn = {
  submitForm: (data: FormData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

const useSubmitForm = ({
  isUpdate = false,
}: UseSubmitFormParams = {}): UseCreateProfileReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const submitForm = async (data: FormData) => {
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
      if (data.address) {
        form.append("address", JSON.stringify(data.address));
      }
      if (data.defaultSchedule) {
        form.append("defaultSchedule", JSON.stringify(data.defaultSchedule));
      }
      if (data.collaborators) {
        form.append("collaborators", JSON.stringify(data.collaborators));
      }
      if (data.createdCollaborators) {
        const cleanedCollaborators = data.createdCollaborators.map(
          (collaborator) => {
            const { id, ...collaboratorWithoutId } = collaborator;
            return collaboratorWithoutId;
          }
        );
        form.append(
          "createdCollaborators",
          JSON.stringify(cleanedCollaborators)
        );
      }
      if (data.profilePicture instanceof File) {
        form.append("profilePicture", data.profilePicture);
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/create-creator`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      const url = isUpdate
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/update-creator`
        : data.userType === "creator"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/create-creator`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/users/create-organizer`;

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
