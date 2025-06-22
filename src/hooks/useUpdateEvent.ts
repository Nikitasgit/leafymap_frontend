import { useState } from "react";
import axios from "axios";
import { fetchUser } from "@/store/userSlice";
import { useAppDispatch } from "@/store";
import { useRouter, useParams } from "next/navigation";
import { EventFormData } from "@/components/events/form/EventForm";
import { parseDateToUTC } from "@/utils/dates";

type UseUpdateEventReturn = {
  submitForm: (data: EventFormData, isUpdate: boolean) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
};

const useUpdateEvent = (): UseUpdateEventReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { placeId, eventId } = useParams();

  const submitForm = async (data: EventFormData, isUpdate: boolean) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isUpdate && !placeId && !eventId) {
        throw new Error("Place ID or event ID is required for update");
      }

      if (!data.name?.trim()) {
        throw new Error("Please add a title");
      }
      if (!data.description?.trim()) {
        throw new Error("Please add a description");
      }

      const form = new FormData();

      form.append("name", data.name);
      form.append("description", data.description);

      const formattedSchedule = data.schedule.map((period) => ({
        ...period,
        startDate: parseDateToUTC(period.startDate),
        endDate: parseDateToUTC(period.endDate),
      }));

      form.append("schedule", JSON.stringify(formattedSchedule));

      if (data.collaborators) {
        const collaboratorData = data.collaborators.map((collab) => ({
          userId: collab._id,
          status: collab.status || "pending",
        }));
        form.append("collaborators", JSON.stringify(collaboratorData));
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}/events/${eventId}`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}/events`,
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

export default useUpdateEvent;
