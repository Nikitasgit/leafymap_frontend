import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import TextField from "@/components/common/inputs/textField/TextField";
import { useState, useEffect, useCallback } from "react";
import NewDatesEventForm from "../NewDatesEventForm/NewDatesEventForm";
import Button from "@/components/common/buttons/button/Button";
import useSubmitEvent from "@/hooks/useSubmitEvent";
import { EventTimeSlot, Period } from "@/types/place/schedule";
import Partnerships from "@/components/account/formComponents/collaborators/Partnerships";
import { useParams, useRouter } from "next/navigation";
import styles from "./EventForm.module.scss";
import EventScheduleList from "../EventScheduleList/EventScheduleList";
import { format } from "date-fns";
import { useToast } from "@/hooks/useToast";
import { Event } from "@/types/place/event";
import { Partnership } from "@/types/partnerships";
import { useSubmitPartnerships } from "@/hooks/useSubmitPartnerships";
import { separateNewAndUpdatedArrayValues } from "@/utils/tempId";
import { validateEventData } from "@/validations/eventValidations";

export interface initialEventData {
  name: string;
  description: string;
  schedule: Period[];
}

interface EventFormProps {
  eventData?: Event | null;
  isUpdate?: boolean;
  partnershipsData?: Partnership[];
}

const initialEventData = (
  event: initialEventData | null
): initialEventData => ({
  name: event?.name || "",
  description: event?.description || "",
  schedule: event?.schedule || [],
});
const EventForm = ({
  eventData = null,
  isUpdate = false,
  partnershipsData = [],
}: EventFormProps) => {
  const router = useRouter();
  const params = useParams();
  const placeId = params.placeId as string;
  const { submitEvent, isLoading: submitFormLoading } = useSubmitEvent();
  const { submitPartnerships, isLoading: submitPartnershipsLoading } =
    useSubmitPartnerships();

  const [event, setEvent] = useState<initialEventData>(
    initialEventData(eventData)
  );
  const [partnerships, setPartnerships] =
    useState<Partnership[]>(partnershipsData);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const { showError, showSuccess } = useToast();
  const [errors, setErrors] = useState<{
    event: Record<string, string>;
  }>({ event: {} });

  const onEventChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const validateFormData = useCallback((): boolean => {
    const eventValidation = validateEventData(event);
    setErrors((prev) => ({
      ...prev,
      event: eventValidation.errors,
    }));
    return eventValidation.isValid;
  }, [event]);

  useEffect(() => {
    if (eventData) setEvent(initialEventData(eventData));
    if (partnershipsData && partnershipsData.length > 0)
      setPartnerships(partnershipsData);
  }, [eventData, partnershipsData]);

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [hasAttemptedSubmit, validateFormData]);

  const loading = submitPartnershipsLoading || submitFormLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    try {
      if (!validateFormData()) {
        showError("Veuillez corriger les erreurs du formulaire");
        return;
      }
      if (event) {
        const eventId = await submitEvent(event, isUpdate);
        if (eventId && partnerships.length > 0) {
          const { newValues, updatedValues } =
            separateNewAndUpdatedArrayValues(partnerships);
          if (newValues.length > 0) {
            await submitPartnerships(newValues, false, placeId, eventId);
          }
          if (updatedValues.length > 0) {
            await submitPartnerships(updatedValues, true, placeId, eventId);
          }
        }
      }
      showSuccess(
        isUpdate
          ? "Évènement modifié avec succès"
          : "Évènement créé avec succès"
      );
      router.push(`/account`);
    } catch {
      showError(
        isUpdate
          ? "Erreur lors de la modification de l'évènement"
          : "Erreur lors de la création de l'évènement"
      );
    }
  };

  const onUpdatePeriod = (
    periodId: string,
    startDate: Date,
    endDate: Date | null
  ) => {
    setEvent((prev) => ({
      ...prev,
      schedule: prev.schedule.map((period) =>
        period._id === periodId
          ? {
              ...period,
              startDate: format(startDate, "dd-MM-yyyy"),
              endDate: endDate ? format(endDate, "dd-MM-yyyy") : "",
            }
          : period
      ),
    }));
  };

  const onDeletePeriod = (periodId: string) => {
    if (
      confirm("Tous les créneaux de cette période seront également supprimés")
    ) {
      setEvent((prev) => ({
        ...prev,
        schedule: prev.schedule.filter((period) => period._id !== periodId),
      }));
    }
  };

  const onUpdateTimeSlot = (periodId: string, timeSlot: EventTimeSlot) => {
    setEvent((prev) => ({
      ...prev,
      schedule: prev.schedule.map((period) =>
        period._id === periodId
          ? {
              ...period,
              timeSlots: period.timeSlots.some(
                (slot) => slot._id === timeSlot._id
              )
                ? period.timeSlots.map((slot) =>
                    slot._id === timeSlot._id ? timeSlot : slot
                  )
                : [...period.timeSlots, timeSlot],
            }
          : period
      ),
    }));
  };

  const onDeleteTimeSlot = (periodId: string, timeSlotId: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce créneau ?")) {
      setEvent((prev) => ({
        ...prev,
        schedule: prev.schedule.map((period) =>
          period._id === periodId
            ? {
                ...period,
                timeSlots: period.timeSlots.filter(
                  (slot) => slot._id !== timeSlotId
                ),
              }
            : period
        ),
      }));
    }
  };
  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextField
        label="Nom de l'évènement"
        fullWidth
        required
        name="name"
        placeholder="Nom de l'évènement"
        value={event.name}
        onChange={onEventChange}
        error={!!errors.event.name}
        errorMessage={errors.event.name}
      />
      <TextField
        multiline
        fullWidth
        required
        rows={2}
        label="Description"
        name="description"
        placeholder="Description"
        value={event.description}
        onChange={onEventChange}
        error={!!errors.event.description}
        errorMessage={errors.event.description}
      />
      <Partnerships onChange={setPartnerships} partnerships={partnerships} />
      <NewDatesEventForm onChange={onEventChange} data={event} />
      <EventScheduleList
        schedule={event.schedule}
        partnerships={partnerships}
        onUpdatePeriod={onUpdatePeriod}
        onUpdateTimeSlot={onUpdateTimeSlot}
        onDeletePeriod={onDeletePeriod}
        onDeleteTimeSlot={onDeleteTimeSlot}
        errors={errors.event}
      />
      <div className={styles.buttonContainer}>
        <Button
          type="button"
          fullWidth
          size="large"
          variant="secondary"
          onClick={() => router.back()}
        >
          Annuler
        </Button>
        <Button type="submit" fullWidth size="large" disabled={loading}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
