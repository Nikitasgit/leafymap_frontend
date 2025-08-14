import { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { EventFormData } from "@/components/events/form/EventForm/EventForm";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { isTempId } from "@/utils/tempId";
import { parseDateToUTC } from "@/utils/dates";

type UseUpdateEventReturn = {
  submitForm: (data: EventFormData, isUpdate: boolean) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

const useUpdateEvent = (): UseUpdateEventReturn => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const placeId = params.placeId as string;
  const eventId = params.eventId as string;

  const submitForm = async (data: EventFormData, isUpdate: boolean) => {
    setError(null);
    setSuccess(false);

    try {
      if (isUpdate && !placeId && !eventId) {
        throw new Error("Place ID or event ID is required for update");
      }
      const payload = {
        name: data.name,
        description: data.description,
        schedule: data.schedule.map((period) => ({
          ...period,
          startDate: parseDateToUTC(period.startDate),
          endDate: period.endDate
            ? parseDateToUTC(period.endDate)
            : parseDateToUTC(period.startDate),
          _id: isTempId(period._id) ? undefined : period._id,
          timeSlots: period.timeSlots?.map((slot) => ({
            ...slot,
            _id: isTempId(slot._id) ? undefined : slot._id,
            collaborators: slot.collaborators?.map((collaborator) => ({
              _id: collaborator._id,
              status: collaborator.status || "pending",
            })),
            createdCollaborators: slot.createdCollaborators?.map(
              (collaborator) => ({
                name: collaborator.name,
                category: collaborator.category,
                _id: isTempId(collaborator._id!) ? undefined : collaborator._id,
              })
            ),
          })),
        })),
        collaborators: data.collaborators?.map((collab) => ({
          _id: collab._id,
          status: collab.status || "pending",
        })),
        createdCollaborators: data.createdCollaborators?.map((collaborator) => {
          return {
            name: collaborator.name,
            category: collaborator.category,
            _id: isTempId(collaborator._id!) ? undefined : collaborator._id,
          };
        }),
      };

      if (isUpdate) {
        await withLoading(() =>
          axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}/events/${eventId}`,
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
          axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}/events`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          )
        );
      }

      showSuccess(
        isUpdate
          ? "Événement modifié avec succès"
          : "Événement créé avec succès"
      );
      router.push("/account");
    } catch (err: unknown) {
      console.error("Update event error:", err);
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
            : "Erreur lors de la soumission de l'événement"
        );
      }
    }
  };

  return { submitForm, loading: isLoading, error, success };
};

export default useUpdateEvent;
