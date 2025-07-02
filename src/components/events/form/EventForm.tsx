import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import ProfilePictureUploader from "@/components/account/formComponents/ProfilePictureUploader";
import TextField from "@/components/common/inputs/textField/TextField";
import React, { useState } from "react";
import ScheduleForm from "./ScheduleForm";
import Button from "@/components/common/buttons/button/Button";
import useUpdateEvent from "@/hooks/useUpdateEvent";

import { Collaborator, CreatedCollaborator } from "@/types/place/collaborators";
import { Period } from "@/types/place/schedule";
import Collaborators from "@/components/account/formComponents/collaborators/Collaborators";

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

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Nom de l'évènement"
        name="name"
        placeholder="Nom de l'évènement"
        value={formData.name}
        onChange={onChange}
      />
      <TextField
        multiline
        rows={2}
        label="Description"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={onChange}
      />
      <Collaborators onChange={onChange} data={formData} />
      <ScheduleForm onChange={onChange} data={formData} />
      <ProfilePictureUploader
        onChange={onChange}
        initialImage={formData.image as string}
      />
      <Button type="submit" disabled={loading}>
        Enregistrer
      </Button>
    </form>
  );
};

export default EventForm;
