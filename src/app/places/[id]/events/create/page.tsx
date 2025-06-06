"use client";

import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import EventForm, { EventFormData } from "@/components/events/form/EventForm";
import { useState } from "react";

const CreateEventPage = () => {
  const [data, setData] = useState<EventFormData>({
    name: "",
    description: "",
    image: "",
    collaborators: [],
    createdCollaborators: [],
    schedule: [],
  });

  const handleInputChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  return <EventForm data={data} onChange={handleInputChange} />;
};

export default CreateEventPage;
