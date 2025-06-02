"use client";

import {
  FormData,
  FormDataChangeHandler,
} from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { selectUser } from "@/store/userSlice";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createEmptySchedule } from "@/components/account/createProfileStepper/CreateProfileStepper";
import ActivityFormStep from "@/components/account/createProfileStepper/steps/ActivityFormStep/ActivityFormStep";
import useSubmitForm from "@/hooks/useUpdateUser";
import { Creator } from "@/types/user";

const ModifyCreator = () => {
  const { user } = useSelector(selectUser);
  const creator = user as Creator;
  const [formData, setFormData] = useState<FormData | null>(null);
  const { submitForm } = useSubmitForm();

  useEffect(() => {
    if (creator && creator.creatorProfile && !formData) {
      const creatorPlace = creator.creatorProfile.place?.location;
      const coordinates = creatorPlace?.coordinates
        ? {
            latitude: creatorPlace.coordinates[1],
            longitude: creatorPlace.coordinates[0],
          }
        : null;

      const data: FormData = {
        userType: creator.userType || "",
        name: creator.creatorProfile.name || "",
        description: creator.description || "",
        category: creator.creatorProfile.categories?.[0]._id || "",
        location: creatorPlace
          ? {
              id: creatorPlace.id || "",
              label: creatorPlace.label || "",
              coordinates: coordinates!,
            }
          : null,
        defaultSchedule:
          creator.creatorProfile.place?.defaultSchedule ||
          createEmptySchedule(),
        placeCategory: creator.creatorProfile.place?.placeCategory._id || "",
        phone: creator.phone || "",
        email: creator.email || "",
        website: creator.website || "",
        image: creator.image || "",
        collaborators: [],
        createdCollaborators: [],
        placeActive: creator.creatorProfile.place?.active || false,
      };

      setFormData(data);
    }
  }, [formData, creator]);
  console.log(formData);

  const handleInputChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData((prev) => ({ ...prev!, [name]: value }));
  };
  const handleSubmit = async () => {
    if (!formData) return;
    await submitForm(formData, true);
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <ActivityFormStep
      firstStep={true}
      isCreator={true}
      data={formData}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      submitButtonText="Enregistrer"
    />
  );
};

export default ModifyCreator;
