import { useState } from "react";
import axios from "axios";

import { fetchUser } from "@/store/userSlice";
import { useAppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import { Location } from "@/types/map";
import {
  createdCollaborator,
  DefaultSchedule,
} from "../components/account/createProfileStepper/CreateProfileStepper.types";
import { Collaborator } from "@/components/account/createProfileStepper/steps/ActivityFormStep/formComponents/CreatePartner";

export type PlaceFormData = {
  title: string;
  description: string;
  placeCategory: string;
  phone: string;
  email: string;
  website: string;
  location: Location;
  defaultSchedule: DefaultSchedule;
  placeImg: File;
  collaborators: Collaborator[];
  createdCollaborators: createdCollaborator[];
  placeId?: string;
  isUpdate: boolean;
};

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
  const submitForm = async (data: PlaceFormData, isUpdate: boolean) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const form = new FormData();
      form.append("title", data.title);
      form.append("description", data.description);
      form.append("placeCategory", data.placeCategory);
      form.append("phone", data.phone);
      form.append("email", data.email);
      form.append("website", data.website);
      form.append("location", JSON.stringify(data.location));
      form.append("defaultSchedule", JSON.stringify(data.defaultSchedule));
      if (data.placeId) {
        form.append("placeId", data.placeId);
      }
      if (data.collaborators) {
        form.append("collaborators", JSON.stringify(data.collaborators));
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
      if (data.placeImg instanceof File) {
        form.append("placeImg", data.placeImg);
      }
      if (isUpdate) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/places/update-place`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/places/create-place`,
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
