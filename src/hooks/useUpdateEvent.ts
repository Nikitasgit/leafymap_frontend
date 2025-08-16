import { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { EventFormData } from "@/components/events/form/EventForm/EventForm";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { isTempId } from "@/utils/tempId";
import { parseDateToUTC } from "@/utils/dates";
import { useCreatePartnerships } from "./useCreatePartnerships";
import { useUpdatePartnerships } from "./useUpdatePartnerships";

type UseUpdateEventReturn = {
  submitForm: (data: EventFormData, isUpdate: boolean) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

const useUpdateEvent = (): UseUpdateEventReturn => {
  const { isLoading, withLoading } = useLoading();
  const { createPartnerships } = useCreatePartnerships();
  const { updatePartnerships } = useUpdatePartnerships();
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
    const { partnerships, ...eventData } = data;
    const existingPartnerships = partnerships.filter(
      (partnership) => !isTempId(partnership._id)
    );
    const newPartnerships = partnerships.filter((partnership) =>
      isTempId(partnership._id)
    );

    try {
      if (isUpdate && !placeId && !eventId) {
        throw new Error("Place ID or event ID is required for update");
      }
      const payload = {
        name: eventData.name,
        description: eventData.description,
        schedule: eventData.schedule.map((period) => ({
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
            })),
          })),
        })),
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
        if (existingPartnerships.length > 0) {
          await updatePartnerships(existingPartnerships, placeId);
        }
        if (newPartnerships.length > 0) {
          await createPartnerships(newPartnerships, placeId, eventId);
        }
      } else {
        await withLoading(async () => {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}/events`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          const { place } = response.data.data;
          if (newPartnerships.length > 0) {
            await createPartnerships(newPartnerships, place._id, eventId);
          }
        });
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
