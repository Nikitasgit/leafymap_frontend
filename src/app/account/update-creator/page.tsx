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

const ModifyCreator = () => {
  const { user } = useSelector(selectUser);
  const [formData, setFormData] = useState<FormData | null>(null);
  const { submitForm } = useSubmitForm();
  useEffect(() => {
    if (user && user.creatorProfile && !formData) {
      const creatorPlace = user.creatorProfile.place?.location;

      const coordinates =
        creatorPlace?.coordinates?.length === 2 &&
        typeof creatorPlace.coordinates[0] === "number" &&
        typeof creatorPlace.coordinates[1] === "number"
          ? {
              latitude: creatorPlace.coordinates[1],
              longitude: creatorPlace.coordinates[0],
            }
          : undefined;

      const data: FormData = {
        userType: user.userType || "",
        name: user.creatorProfile.name || "",
        description: user.description || "",
        category: user.creatorProfile.categories?.[0]._id || "",
        location: creatorPlace
          ? {
              id: creatorPlace.id || "",
              label: creatorPlace.label || "",
              coordinates: coordinates!,
            }
          : null,
        defaultSchedule:
          user.creatorProfile.place?.defaultSchedule || createEmptySchedule(),
        placeCategory: user.creatorProfile.place?.placeCategory._id || "",
        phone: user.phone || "",
        email: user.email || "",
        website: user.website || "",
        profilePicture: user.userImg || "",
        collaborators: [],
        createdCollaborators: [],
      };

      setFormData(data);
    }
  }, [user, formData]);

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
      isCreator={true}
      data={formData}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      submitButtonText="Enregistrer"
    />
  );
};

export default ModifyCreator;
