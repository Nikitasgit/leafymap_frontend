import { useState } from "react";
import axios from "axios";
import { fetchUser } from "@/store/userSlice";
import { useAppDispatch } from "@/store";
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
  const dispatch = useAppDispatch();
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

      const payload = {
        name: data.name,
        description: data.description,
        placeCategory: data.placeCategory,
        phone: data.phone,
        email: data.email,
        website: data.website,
        location: data.location,
        defaultSchedule: data.defaultSchedule,
        collaborators: data.collaborators?.map((collab) => ({
          _id: collab._id,
        })),
        createdCollaborators: data.createdCollaborators?.map((collaborator) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...collaboratorWithoutId } = collaborator;
          return collaboratorWithoutId;
        }),
        placeType: data.placeType,
      };
      console.log(payload);
      if (isUpdate) {
        await withLoading(() =>
          axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}`,
            payload,
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
          axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/places`, payload, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          })
        );
      }

      showSuccess("Lieu modifié avec succès");
      router.push("/account");
      dispatch(fetchUser());
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
