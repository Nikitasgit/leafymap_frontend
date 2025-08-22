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
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

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
  active: place?.active || false,
});

const ModifyCreator = () => {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { submitUser, isLoading: submitUserLoading } = useUpdateUser();
  const { submitPlace, isLoading: submitPlaceLoading } = useSubmitPlace();
  const { place: placeData, isLoading: placeLoading } = usePlace(
    user?.places?.[0]?._id || null
  );
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [updatedUser, setUpdatedUser] = useState<InitialCreatorData | null>(
    null
  );
  const [place, setPlace] = useState<InitialPlaceData>(
    initialPlaceData(placeData)
  );
  console.log("place", place);
  const onUserChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const onPlaceChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setPlace((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (updatedUser) {
        await submitUser(updatedUser);
        if (placeData) {
          const dataToSubmit = place.active
            ? place
            : { active: false, placeType: place.placeType };
          await submitPlace(dataToSubmit, true, placeData?._id);
        } else if (!placeData && place.active) {
          await submitPlace(place);
        }
        showSuccess("Profil mis à jour avec succès");
        router.push("/account");
      }
    } catch {
      showError("Erreur lors de la mise à jour");
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
        initialPlaceLocation={placeData?.location}
        onUserChange={onUserChange}
        onPlaceChange={onPlaceChange}
        onSubmit={handleSubmit}
        submitButtonText="Enregistrer"
      />
    </div>
  );
};

export default ModifyCreator;
