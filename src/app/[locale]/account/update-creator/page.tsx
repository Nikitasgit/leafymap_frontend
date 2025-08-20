"use client";

import {
  FormDataChangeHandler,
  InitialCreatorData,
  InitialPlaceData,
} from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { useState, useEffect } from "react";
import ActivityFormStep from "@/components/account/createProfileStepper/steps/ActivityFormStep/ActivityFormStep";
import useUpdateUser from "@/hooks/useSubmitUser";
import { defaultSchedule } from "@/utils/createProfile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoadingBar from "@/components/common/loading/LoadingBar";
import styles from "./updateCreatorPage.module.scss";
import { usePlace } from "@/hooks/usePlace";
import useSubmitPlace from "@/hooks/useSubmitPlace";

const initialUserData = (user: InitialCreatorData): InitialCreatorData => ({
  userType: user.userType || "creator",
  creatorName: user.creatorName || "",
  description: user.description || "",
  creatorCategories: user.creatorCategories || [],
  website: user.website || "",
});

const initialPlaceData = (
  place: InitialPlaceData | null
): InitialPlaceData => ({
  name: place?.name || "",
  description: place?.description || "",
  location: place?.location || null,
  defaultSchedule: place?.defaultSchedule || defaultSchedule,
  placeCategory:
    typeof place?.placeCategory === "string"
      ? place.placeCategory
      : place?.placeCategory?._id || "",
  phone: place?.phone || "",
  email: place?.email || "",
  website: place?.website || "",
  placeType: place?.placeType || [],
  active: place?.active || true,
});

const ModifyCreator = () => {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { submitUser, isLoading: submitUserLoading } = useUpdateUser();
  const { submitPlace, isLoading: submitPlaceLoading } = useSubmitPlace();
  const { place: placeData, isLoading: placeLoading } = usePlace(
    user?.places?.[0]._id || ""
  );

  const [updatedUser, setUpdatedUser] = useState<InitialCreatorData | null>(
    null
  );
  const [place, setPlace] = useState<InitialPlaceData>(
    initialPlaceData(placeData)
  );

  const onUserChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const onPlaceChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setPlace((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (updatedUser) {
      await submitUser(updatedUser);
      if (place) {
        await submitPlace(place);
      }
    }
  };

  const loading =
    userLoading ||
    !updatedUser ||
    submitUserLoading ||
    submitPlaceLoading ||
    placeLoading;

  useEffect(() => {
    if (placeData) setPlace(initialPlaceData(placeData));
    if (user) setUpdatedUser(initialUserData(user));
  }, [placeData, user]);

  if (loading) {
    return <LoadingBar />;
  }
  return (
    <div className={styles.pageContainer}>
      <ActivityFormStep
        firstStep={true}
        user={updatedUser}
        place={place}
        onUserChange={onUserChange}
        onPlaceChange={onPlaceChange}
        onSubmit={handleSubmit}
        submitButtonText="Enregistrer"
      />
    </div>
  );
};

export default ModifyCreator;
