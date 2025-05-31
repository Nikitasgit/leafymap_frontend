"use client";

import { createEmptySchedule } from "@/components/account/createProfileStepper/CreateProfileStepper";
import ActivityFormStep from "@/components/account/createProfileStepper/steps/ActivityFormStep/ActivityFormStep";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePlace } from "@/hooks/usePlace";
import {
  FormData,
  FormDataChangeHandler,
} from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import useUpdatePlace from "@/hooks/useUpdatePlace";

const UpdatePlace = () => {
  const params = useParams();
  const placeId = params.id as string;
  const { place, loading, error } = usePlace(placeId);
  const { submitForm } = useUpdatePlace();
  const [formData, setFormData] = useState<FormData | null>(null);

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
      const data: FormData = {
        name: place.name || "",
        description: place.description || "",
        location: {
          id: place.location?.id || "",
          label: place.location?.label || "",
          coordinates: coordinates || { latitude: 0, longitude: 0 },
        },
        defaultSchedule: place.defaultSchedule || createEmptySchedule(),
        placeCategory: place.placeCategory._id || "",
        phone: place.phone || "",
        email: place.email || "",
        website: place.website || "",
        image: place.image || "",
        collaborators:
          place.collaborators?.map((collab) => ({
            icon: collab.user?.image || "",
            label: collab.user?.username || "",
            id: collab.user?._id || "",
          })) || [],
        createdCollaborators:
          place.createdCollaborators?.map((collab) => ({
            name: collab.name || "",
            category: collab.category || "",
            id: collab._id || "",
            _id: collab._id || "",
          })) || [],
      };

      setFormData(data);
    }
  }, [place, loading, error, formData]);

  if (loading || !formData) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  console.log(place);

  return (
    <main>
      <ActivityFormStep
        firstStep={true}
        isCreator={false}
        data={formData}
        onChange={handleInputChange}
        onSubmit={onSubmit}
        submitButtonText="Enregistrer"
      />
    </main>
  );
};

export default UpdatePlace;
