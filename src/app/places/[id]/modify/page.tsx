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

const UpdatePlace = () => {
  const params = useParams();
  const placeId = params.id as string;
  const { place, loading, error } = usePlace(placeId);

  const [formData, setFormData] = useState<FormData>(null);

  const handleInputChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  useEffect(() => {
    if (place && !formData) {
      const coordinates = {
        latitude: place.location.coordinates[1],
        longitude: place.location.coordinates[0],
      };
      const data: FormData = {
        name: place.title || "",
        description: place.description || "",
        address: place.location
          ? {
              id: place.location.id || "",
              label: place.location.label || "",
              coordinates: coordinates!,
            }
          : null,
        defaultSchedule: place.defaultSchedule || createEmptySchedule(),
        placeCategory: place.placeCategory || "",
        phone: place.phone || "",
        email: place.email || "",
        website: place.website || "",
        profilePicture: place.placeImg || "",
        collaborators: [],
        createdCollaborators: [],
      };

      setFormData(data);
    }
  }, [place, loading, error, formData]);
  if (loading || !formData) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      <ActivityFormStep
        isCreator={false}
        data={formData}
        onChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </main>
  );
};

export default UpdatePlace;
