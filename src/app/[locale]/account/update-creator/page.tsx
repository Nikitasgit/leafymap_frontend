"use client";

import {
  NewProfileFormData,
  FormDataChangeHandler,
} from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { useState, useEffect } from "react";
import ActivityFormStep from "@/components/account/createProfileStepper/steps/ActivityFormStep/ActivityFormStep";
import useUpdateUser from "@/hooks/useUpdateUser";
import { Creator } from "@/types/user";
import { defaultSchedule } from "@/utils/createProfile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoadingBar from "@/components/common/loading/LoadingBar";
import styles from "./updateCreatorPage.module.scss";

const ModifyCreator = () => {
  const { user, isLoading } = useCurrentUser();
  const creator = user as Creator | null;
  const [formData, setFormData] = useState<NewProfileFormData | null>(null);
  const { submitForm } = useUpdateUser();
  useEffect(() => {
    if (creator && creator.creatorProfile && !formData) {
      const creatorPlace = creator.creatorProfile.place?.location;
      const coordinates = creatorPlace?.coordinates
        ? {
            latitude: creatorPlace.coordinates[1],
            longitude: creatorPlace.coordinates[0],
          }
        : null;

      const data: NewProfileFormData = {
        userType: creator.userType || "",
        name: creator.creatorProfile.name || "",
        description: creator.description || "",
        category: creator.creatorProfile.categories?.[0]?._id || "",
        location: creatorPlace
          ? {
              type: "Point",
              id: creatorPlace.id || "",
              label: creatorPlace.label || "",
              coordinates: [coordinates!.longitude, coordinates!.latitude],
            }
          : null,
        defaultSchedule:
          creator.creatorProfile.place?.defaultSchedule || defaultSchedule,
        placeCategory: creator.creatorProfile.place?.placeCategory._id || "",
        phone: creator.phone || "",
        email: creator.email || "",
        website: creator.website || "",
        collaborators: [],
        createdCollaborators: [],
        placeActive: creator.creatorProfile.place?.active || false,
      };

      setFormData(data);
    }
  }, [formData, creator]);
  const handleInputChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData((prev) => ({ ...prev!, [name]: value }));
  };
  const handleSubmit = async () => {
    if (!formData) return;
    await submitForm(formData, true);
  };

  if (isLoading || !formData) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.pageContainer}>
      <ActivityFormStep
        firstStep={true}
        isCreator={true}
        data={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        submitButtonText="Enregistrer"
      />
    </div>
  );
};

export default ModifyCreator;
