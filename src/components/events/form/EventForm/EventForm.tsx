import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";

import TextField from "@/components/common/inputs/textField/TextField";
import React, { useState } from "react";
import NewDatesEventForm from "../NewDatesEventForm/NewDatesEventForm";
import Button from "@/components/common/buttons/button/Button";
import useUpdateEvent from "@/hooks/useUpdateEvent";

import { Collaborator, CreatedCollaborator } from "@/types/place/collaborators";
import { EventTimeSlot, Period } from "@/types/place/schedule";
import Collaborators from "@/components/account/formComponents/collaborators/Collaborators";
import { useRouter } from "next/navigation";
import styles from "./EventForm.module.scss";
import EventScheduleList from "../EventScheduleList/EventScheduleList";
import { format } from "date-fns";

export interface EventFormData {
  name: string;
  description: string;
  image: string | File;
  collaborators: Collaborator[];
  createdCollaborators: CreatedCollaborator[];
  schedule: Period[];
}

interface EventFormProps {
  data?: EventFormData;
  isUpdate?: boolean;
}

const EventForm = ({ data, isUpdate = false }: EventFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<EventFormData>({
    name: data?.name || "",
    description: data?.description || "",
    image: data?.image || "",
    collaborators: data?.collaborators || [],
    createdCollaborators: data?.createdCollaborators || [],
    schedule: data?.schedule || [],
  });
  const onChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const { submitForm, loading } = useUpdateEvent();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitForm(formData, isUpdate);
  };

  const onUpdatePeriod = (
    periodId: string,
    startDate: Date,
    endDate: Date | null
  ) => {
    setFormData((prev) => ({
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
      setFormData((prev) => ({
        ...prev,
        schedule: prev.schedule.filter((period) => period._id !== periodId),
      }));
    }
  };
  const onUpdateTimeSlot = (periodId: string, timeSlot: EventTimeSlot) => {
    setFormData((prev) => ({
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
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Nom de l'évènement"
        fullWidth
        required
        name="name"
        placeholder="Nom de l'évènement"
        value={formData.name}
        onChange={onChange}
      />
      <TextField
        multiline
        fullWidth
        required
        rows={2}
        label="Description"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={onChange}
      />

      <Collaborators onChange={onChange} data={formData} />
      <NewDatesEventForm onChange={onChange} data={formData} />
      <EventScheduleList
        schedule={formData.schedule}
        collaborators={formData.collaborators}
        onUpdatePeriod={onUpdatePeriod}
        onUpdateTimeSlot={onUpdateTimeSlot}
        onDeletePeriod={onDeletePeriod}
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
