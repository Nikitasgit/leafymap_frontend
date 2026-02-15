"use client";
import { FormDataChangeHandler } from "@/components/account/CreateProfileStepper/CreateProfileStepper.types";
import TextField from "@/components/common/inputs/TextField/TextField";
import { useState, useEffect, useCallback } from "react";
import NewDatesEventForm from "../EventNewDatesSelector/EventNewDatesSelector";
import Button from "@/components/common/buttons/Button";
import useSubmitEvent from "@/hooks/useSubmitEvent";
import { useParams, useRouter } from "next/navigation";
import { getAccountEventsPath, EVENTS_TAB_IDS } from "@/utils/accountTabs";
import styles from "./EventForm.module.scss";
import EventScheduleList from "../EventScheduleList";
import { format } from "date-fns";
import { useToast } from "@/hooks/useToast";
import { Partnership, PartnershipPopulated } from "@/types/partnerships";
import { useSubmitEventInvitations } from "@/hooks/useSubmitEventInvitations";
import { separateNewAndUpdatedArrayValues } from "@/utils/tempId";
import { validateEventData } from "@/validations/eventValidations";
import { useEventSchedule } from "@/hooks/useEventSchedule";
import type { initialEventData, EventFormProps } from "./EventForm.types";
import PartnershipsForm from "../../Partnership/PartnershipsForm";

const initialEventData = (
  event: initialEventData | null
): initialEventData => ({
  name: event?.name || "",
  description: event?.description || "",
  schedule:
    event?.schedule.map((period) => ({
      ...period,
      startDate: format(new Date(period.startDate), "dd-MM-yyyy"),
      endDate: period.endDate
        ? format(new Date(period.endDate), "dd-MM-yyyy")
        : "",
    })) || [],
});

const EventForm = ({
  eventData = null,
  isUpdate = false,
  partnershipsData = [],
}: EventFormProps) => {
  const router = useRouter();
  const params = useParams();
  const placeId = params.placeId as string;
  console.log(eventData);
  const { submitEvent, isLoading: submitFormLoading } = useSubmitEvent();
  const { submitEventInvitations, isLoading: submitEventInvitationsLoading } =
    useSubmitEventInvitations();
  const { showError, showSuccess } = useToast();

  const [partnerships, setPartnerships] =
    useState<Partnership[]>(partnershipsData);
  const [event, setEvent] = useState<initialEventData>(
    initialEventData(eventData)
  );
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [errors, setErrors] = useState<{
    event: Record<string, string>;
  }>({ event: {} });

  const { onUpdatePeriod, onDeletePeriod, onUpdateTimeSlot, onDeleteTimeSlot } =
    useEventSchedule({ setEvent });

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

  const loading = submitEventInvitationsLoading || submitFormLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    try {
      if (!validateFormData()) {
        showError("Veuillez corriger les erreurs du formulaire");
        return;
      }
      if (event) {
        // send event data to server
        const { _id: eventId } = await submitEvent(
          event,
          isUpdate,
          eventData?._id
        );
        // send partnerships data to server if event is created
        if (eventId && partnerships.length > 0) {
          const { newValues, updatedValues } =
            separateNewAndUpdatedArrayValues(partnerships);
          if (newValues.length > 0) {
            await submitEventInvitations(newValues, false, eventId);
          }
          if (updatedValues.length > 0) {
            await submitEventInvitations(updatedValues, true, eventId);
          }
        }
      }
      showSuccess(
        isUpdate
          ? "Évènement modifié avec succès"
          : "Évènement créé avec succès"
      );
      router.push(getAccountEventsPath(EVENTS_TAB_IDS.MY_EVENTS));
    } catch {
      showError(
        isUpdate
          ? "Erreur lors de la modification de l'évènement"
          : "Erreur lors de la création de l'évènement"
      );
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
        showCharCount
        fullWidth
        required
        maxLength={300}
        rows={2}
        label="Description"
        className={styles.description}
        name="description"
        placeholder="Description"
        value={event.description}
        onChange={onEventChange}
        error={!!errors.event.description}
        errorMessage={errors.event.description}
      />
      <PartnershipsForm
        onChange={setPartnerships}
        partnerships={partnerships as PartnershipPopulated[]}
      />
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
          ariaLabel="Annuler"
          disabled={loading}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          fullWidth
          size="large"
          disabled={loading}
          ariaLabel="Enregistrer"
        >
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
