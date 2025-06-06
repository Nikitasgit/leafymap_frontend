import {
  CreatedCollaborator,
  FormDataChangeHandler,
} from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import Partners from "@/components/account/createProfileStepper/steps/ActivityFormStep/formComponents/Partners";
import ProfilePictureUploader from "@/components/account/createProfileStepper/steps/ActivityFormStep/formComponents/ProfilePictureUploader";
import TextField from "@/components/common/inputs/textField/TextField";
import React from "react";
import ScheduleForm from "./ScheduleForm";

export interface Schedule {
  date: string;
  startTime: string;
  endTime: string;
  participants: string[];
}

export interface Collaborator {
  id: string;
  label: string;
  icon?: string;
}

export interface EventFormData {
  name: string;
  description: string;
  image: string;
  collaborators: Collaborator[];
  createdCollaborators: CreatedCollaborator[];
  schedule: Schedule[];
}

interface EventFormProps {
  onChange: FormDataChangeHandler;
  data: EventFormData;
}

const EventForm = ({ onChange, data }: EventFormProps) => {
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
      <ScheduleForm onChange={onChange} data={data} />
      <ProfilePictureUploader
        onChange={onChange}
        initialImage={data.image as string}
      />
    </form>
  );
};

export default EventForm;
