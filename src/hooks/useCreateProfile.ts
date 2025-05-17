import { useState } from "react";
import axios from "axios";
import type { FormData } from "@/components/account/createProfileStepper/CreateProfileStepper.types";

type UseCreateProfileReturn = {
  createProfile: (data: FormData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

const useCreateProfile = (): UseCreateProfileReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createProfile = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const form = new FormData();
      form.append("userType", data.userType);
      form.append("name", data.name);
      form.append("description", data.description);
      form.append("type", "foodmarket");
      form.append("phone", data.phone);
      form.append("email", data.email);
      form.append("website", data.website);
      if (data.address) {
        form.append("address", JSON.stringify(data.address));
      }
      form.append("defaultSchedule", JSON.stringify(data.defaultSchedule));
      form.append("collaborators", JSON.stringify(data.collaborators));
      form.append(
        "createdCollaborators",
        JSON.stringify(data.createdCollaborators)
      );

      if (data.profilePicture instanceof File) {
        form.append("profilePicture", data.profilePicture);
      }
      form.forEach((value, key) => {
        console.log(key, value);
      });

      // Add detailed logging
      console.log(
        "Request URL:",
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/create-profile`
      );
      console.log("Form data entries:");
      for (const pair of form.entries()) {
        console.log(pair[0], pair[1]);
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/create-profile`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création du profil"
      );
    } finally {
      setLoading(false);
    }
  };

  return { createProfile, loading, error, success };
};

export default useCreateProfile;
