import { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { PlaceFormData } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

type UseUpdatePlaceReturn = {
  submitForm: (data: PlaceFormData, isUpdate: boolean) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
};

const useUpdatePlace = (): UseUpdatePlaceReturn => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const placeId = params.placeId as string;

  const submitForm = async (data: PlaceFormData, isUpdate: boolean) => {
    setError(null);
    setSuccess(false);

    try {
      if (isUpdate && !placeId) {
        throw new Error("Place ID is required for update");
      }

      if (isUpdate) {
        await withLoading(() =>
          axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          )
        );
      } else {
        await withLoading(() =>
          axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/places`, data, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          })
        );
      }

      showSuccess("Lieu modifié avec succès");
      router.push("/account");
    } catch (err: unknown) {
      console.error("Update place error:", err);
      if (axios.isAxiosError(err) && err.response?.data) {
        console.error("Backend error details:", err.response.data);
        showError(
          err.response.data.message ||
            (err.response.data.errors
              ? JSON.stringify(err.response.data.errors)
              : err.message)
        );
      } else {
        showError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la soumission du lieu"
        );
      }
    }
  };

  return { submitForm, isLoading, error, success };
};

export default useUpdatePlace;
