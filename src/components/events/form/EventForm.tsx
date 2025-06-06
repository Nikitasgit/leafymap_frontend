import {
  CreatedCollaborator,
  FormDataChangeHandler,
} from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import Partners from "@/components/account/createProfileStepper/steps/ActivityFormStep/formComponents/Partners";
import ProfilePictureUploader from "@/components/account/createProfileStepper/steps/ActivityFormStep/formComponents/ProfilePictureUploader";
import TextField from "@/components/common/inputs/textField/TextField";
import React from "react";
import DateTimePicker from "./DateTimePicker";

export interface Schedule {
  date: string;
  startTime: string;
  endTime: string;
  participants: string[];
}

export interface EventFormData {
  name: string;
  description: string;
  image: string;
  collaborators: string[];
  createdCollaborators: CreatedCollaborator[];
  schedule: Schedule[];
}

interface EventFormProps {
  onChange: FormDataChangeHandler;
  data: EventFormData;
}

const EventForm = ({ onChange, data }: EventFormProps) => {
  const handleScheduleChange = (newSchedule: Schedule[]) => {
    const event = {
      target: {
        name: "schedule",
        value: newSchedule,
      },
    };
    onChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <form className="space-y-6">
      <TextField
        label="Nom de l'évènement"
        name="name"
        placeholder="Nom de l'évènement"
        value={data.name}
        onChange={onChange}
      />
      <TextField
        multiline
        rows={2}
        label="Description"
        name="description"
        placeholder="Description"
        value={data.description}
        onChange={onChange}
      />
      <Partners onChange={onChange} data={data} />
      <DateTimePicker
        schedule={data.schedule}
        onScheduleChange={handleScheduleChange}
      />
      <ProfilePictureUploader
        onChange={onChange}
        initialImage={data.image as string}
      />
    </form>
  );
};

export default EventForm;
