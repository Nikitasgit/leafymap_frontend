"use client";

import ActivityFormStep from "@/components/account/createProfileStepper/steps/ActivityFormStep/ActivityFormStep";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePlace } from "@/hooks/usePlace";
import {
  FormDataChangeHandler,
  PlaceFormData,
} from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import useUpdatePlace from "@/hooks/useUpdatePlace";
import { defaultSchedule } from "@/utils/createProfile";
import { useUser } from "@/hooks/useUser";
import LoadingBar from "@/components/common/loading/LoadingBar";
import styles from "./updatePlacePage.module.scss";

const UpdatePlace = () => {
  const params = useParams();
  const placeId = params.placeId as string;
  const { place, loading } = usePlace(placeId);
  const { user, loading: userLoading } = useUser();
  const { submitForm, isLoading } = useUpdatePlace();
  const [formData, setFormData] = useState<PlaceFormData | null>(null);

  const handleInputChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const onSubmit = async () => {
    if (!formData) return;
    await submitForm(formData, true);
  };

  useEffect(() => {
    if (place && !formData) {
      const coordinates = {
        latitude: place.location.coordinates[1],
        longitude: place.location.coordinates[0],
      };
      const data: PlaceFormData = {
        userType: user?.userType || "guest",
        name: place.name || "",
        description: place.description || "",
        location: {
          id: place.location?.id || "",
          label: place.location?.label || "",
          coordinates: [coordinates.longitude, coordinates.latitude],
          type: "Point",
        },
        defaultSchedule: place.defaultSchedule || defaultSchedule,
        placeCategory: place.placeCategory._id || "",
        phone: place.phone || "",
        email: place.email || "",
        website: place.website || "",
        collaborators:
          place.collaborators?.map((collab) => ({
            _id: collab.user?._id || "",
            username: collab.user?.username || "",
            image: collab.user?.image || "",
          })) || [],
        createdCollaborators:
          place.createdCollaborators?.map((collab) => ({
            name: collab.name || "",
            category: collab.category || "",
            id: collab._id || "",
            _id: collab._id || "",
          })) || [],
        placeType: place.placeType || [],
      };

      setFormData(data);
    }
  }, [place, loading, formData, user]);

  if (loading || !formData || isLoading || userLoading) return <LoadingBar />;

  return (
    <main className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>Modifier votre lieu</h1>
        <ActivityFormStep
          firstStep={true}
          isCreator={false}
          data={formData}
          onChange={handleInputChange}
          onSubmit={onSubmit}
          submitButtonText="Enregistrer"
        />
      </div>
    </main>
  );
};

export default UpdatePlace;
