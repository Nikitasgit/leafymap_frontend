"use client";

import ActivityFormStep from "@/components/account/createProfileStepper/steps/ActivityFormStep/ActivityFormStep";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePlace } from "@/hooks/usePlace";
import {
  FormDataChangeHandler,
  InitialPlaceData,
} from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { defaultSchedule } from "@/utils/createProfile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoadingBar from "@/components/common/loading/LoadingBar";
import styles from "./updatePlacePage.module.scss";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import useSubmitPlace from "@/hooks/useSubmitPlace";
import { Partnership } from "@/types/partnerships";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useSubmitPartnerships } from "@/hooks/useSubmitPartnerships";
import { separateNewAndUpdatedArrayValues } from "@/utils/tempId";

const initialPlaceData = (place: InitialPlaceData): InitialPlaceData => ({
  name: place?.name || "",
  description: place?.description || "",
  location: place?.location || null,
  defaultSchedule: defaultSchedule,
  placeCategory:
    typeof place?.placeCategory === "string"
      ? place.placeCategory
      : place?.placeCategory?._id || "",
  phone: place?.phone || "",
  email: place?.email || "",
  website: place?.website || "",
  placeType: place?.placeType || [],
  active: true,
});

const UpdatePlace = () => {
  const params = useParams();
  const placeId = params.placeId as string;
  const { user, isLoading: userLoading } = useCurrentUser();
  const { submitPlace, isLoading: submitPlaceLoading } = useSubmitPlace();
  const { place: placeData, isLoading: placeLoading } = usePlace(placeId);
  const { partnerships: partnershipsData, isLoading: partnershipsLoading } =
    usePlacePartnerships(placeId);
  const { submitPartnerships, isLoading: submitPartnershipsLoading } =
    useSubmitPartnerships();
  const [place, setPlace] = useState<InitialPlaceData | null>(null);
  const [partnerships, setPartnerships] = useState<Partnership[]>(
    partnershipsData || []
  );
  const { showError, showSuccess } = useToast();
  const router = useRouter();
  const onPlaceChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setPlace((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const onSubmit = async () => {
    try {
      if (placeData && place) {
        const id = placeData._id;
        await submitPlace(place, true, id);
        if (partnerships.length > 0) {
          const { newValues, updatedValues } =
            separateNewAndUpdatedArrayValues(partnerships);
          if (newValues.length > 0) {
            await submitPartnerships(newValues, false, id);
          }
          if (updatedValues.length > 0) {
            await submitPartnerships(updatedValues, true, id);
          }
        }
      }
      showSuccess("Lieu modifié avec succès");
      router.push("/account");
    } catch {
      showError("Erreur lors de la modification du lieu");
    }
  };

  useEffect(() => {
    if (placeData) setPlace(initialPlaceData(placeData));
    if (partnershipsData) setPartnerships(partnershipsData);
  }, [placeData, partnershipsData]);

  const loading =
    placeLoading ||
    submitPlaceLoading ||
    userLoading ||
    partnershipsLoading ||
    submitPartnershipsLoading;

  return (
    <main className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>Modifier votre lieu</h1>
        {loading || !place || !user ? (
          <LoadingBar />
        ) : (
          <ActivityFormStep
            firstStep={true}
            place={place}
            user={user}
            partnerships={partnerships}
            onPlaceChange={onPlaceChange}
            onPartnershipsChange={setPartnerships}
            onSubmit={onSubmit}
            submitButtonText="Enregistrer"
          />
        )}
      </div>
    </main>
  );
};

export default UpdatePlace;
