"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FormDataChangeHandler,
  InitialCreatorData,
  InitialPlaceData,
} from "@/components/account/CreateProfileStepper";
import ActivityFormStep from "@/components/account/CreateProfileSteps/ProfileFormStep";
import useUpdateUser from "@/hooks/useSubmitUser";
import { defaultSchedule } from "@/utils/createProfile";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import useSubmitPlace from "@/hooks/useSubmitPlace";
import { useToast } from "@/hooks/useToast";
import PageHeader from "@/components/common/PageHeader";
import styles from "./UpdateCreator.module.scss";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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

const UpdateCreator = () => {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { submitUser, isLoading: submitUserLoading } = useUpdateUser();
  const { submitPlace, isLoading: submitPlaceLoading } = useSubmitPlace();

  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [updatedUser, setUpdatedUser] = useState<InitialCreatorData | null>(
    null
  );
  const [place, setPlace] = useState<InitialPlaceData>(initialPlaceData(null));

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
        if (user && user.places?.[0]) {
          const dataToSubmit = place.active
            ? place
            : { active: false, placeType: place.placeType };
          await submitPlace(dataToSubmit, true, user.places?.[0]?._id);
        } else if (!user?.places?.[0] && place.active) {
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
    userLoading || !updatedUser || submitUserLoading || submitPlaceLoading;

  useEffect(() => {
    if (user) {
      setUpdatedUser(
        initialUserData({
          ...user,
          creatorCategories: user.creatorCategories.map(
            (category) => category._id
          ),
        })
      );
      setPlace(initialPlaceData(user.places?.[0] || null));
    }
  }, [user]);

  return (
    <div className={styles.pageContainer}>
      <section className={styles.container}>
        <PageHeader title="Modifier votre profil" showBackButton={true} />
        {loading ? (
          <LoadingBar />
        ) : (
          <ActivityFormStep
            firstStep={true}
            user={updatedUser}
            place={place}
            initialPlaceLocation={place?.location}
            onUserChange={onUserChange}
            onPlaceChange={onPlaceChange}
            onSubmit={handleSubmit}
            submitButtonText="Enregistrer"
          />
        )}
      </section>
    </div>
  );
};

export default UpdateCreator;
