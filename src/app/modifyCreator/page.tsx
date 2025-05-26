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
import useSubmitForm from "@/hooks/useSubmitForm";

const ModifyCreator = () => {
  const { user } = useSelector(selectUser);
  const [formData, setFormData] = useState<FormData | null>(null);
  const { submitForm, loading, error, success } = useSubmitForm({
    isUpdate: true,
  });
  useEffect(() => {
    if (user && user.creatorProfile && !formData) {
      const creatorPlace = user.creatorProfile.creatorPlace?.location;

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
        name: user.creatorProfile.creatorName || "",
        description: user.description || "",
        category: user.creatorProfile.categories?.[0]._id || "",
        address: creatorPlace
          ? {
              id: creatorPlace.id || "",
              label: creatorPlace.label || "",
              coordinates: coordinates!,
            }
          : null,
        defaultSchedule:
          user.creatorProfile.creatorPlace?.defaultSchedule ||
          createEmptySchedule(),
        placeCategory: user.creatorProfile.creatorPlace?.placeCategory || "",
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
    await submitForm(formData);
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
