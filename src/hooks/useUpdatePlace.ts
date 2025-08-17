import { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { PlaceFormData } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { useCreatePartnerships } from "./useCreatePartnerships";
import { isTempId } from "@/utils/tempId";
import { useUpdatePartnerships } from "./useUpdatePartnerships";

type UseUpdatePlaceReturn = {
  submitForm: (data: PlaceFormData, isUpdate: boolean) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
};

const useUpdatePlace = (): UseUpdatePlaceReturn => {
  const router = useRouter();
  const params = useParams();
  const placeId = params.placeId as string;
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();
  const { createPartnerships } = useCreatePartnerships();
  const { updatePartnerships } = useUpdatePartnerships();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitForm = async (data: PlaceFormData, isUpdate: boolean) => {
    const { partnerships, ...placeData } = data;
    setError(null);
    setSuccess(false);
    try {
      if (isUpdate && !placeId) {
        throw new Error("Place ID is required for update");
      }

      if (partnerships && partnerships.length > 0) {
        const newPartnerships = partnerships.filter((partnership) =>
          isTempId(partnership._id)
        );
        if (newPartnerships.length > 0) {
          await createPartnerships(newPartnerships, placeId);
        }
        const existingPartnerships = partnerships.filter(
          (partnership) => !isTempId(partnership._id)
        );
        if (existingPartnerships.length > 0) {
          await updatePartnerships(existingPartnerships, placeId);
        }
      }

      if (isUpdate) {
        await withLoading(() =>
          axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}`,
            placeData,
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
          axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/places`,
            placeData,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          )
        );
      }

      showSuccess("Lieu modifié avec succès");
      router.push("/account");
    } catch (err: unknown) {
      console.error("Update place error:", err);
      if (axios.isAxiosError(err) && err.response?.data) {
        console.error("Backend error details:", err.response.data);
        if (err.response.data.data && Array.isArray(err.response.data.data)) {
          err.response.data.data.forEach((error: { message: string }) => {
            showError(error.message);
          });
        } else {
          showError(err.response.data.message);
        }
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
